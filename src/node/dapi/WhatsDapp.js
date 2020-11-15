const Client = require('./Client').Client;
const dapiFacade = new (require('./DAPI_Facade').DAPI_Facade)();
const EventEmitter = require('events');

const pollInterval = 5000

class WhatsDapp extends EventEmitter {

    constructor() {
        super();
        this._connection = {
            identity: null,
            platform: null
        }
        this._lastPollTime = 0 // TODO: save in storage?
    }

    /**
     * @param opts {{mnemonic: string, sessions: Array<{signal: any, identity_receiver: string, profile_name: string}>}}
     * @returns {Promise<{handle:string}>}
     */
    async connect(opts) {
        let {mnemonic, sessions, identity, displayname} = opts;
        this._client = new Client(mnemonic).client;
        this._connection.platform = this._client.platform;
        this._sessions = sessions;

        if (identity == null) {
            let id = await dapiFacade.create_identity(this._connection);
            identity = id.getId().toJSON();
            console.log(identity)
        }

        this._connection.identity = await this._connection.platform.identities.get(identity);
        let profile = await dapiFacade.get_profile(this._connection, identity);

        if (profile == null) {
            console.log("creating new profile!");
            let content = {
                identity_public_key: "Kommt später",
                signed_identity_public_key: "Kommt später",
                prekeys: ["kommt", "später"],
                displayname: displayname,
            };
            await dapiFacade.create_profile(this._connection, content);
            profile = await dapiFacade.get_profile(this._connection, identity);
        }

        this._profile = profile

        // deferred initialization
        this.initialized = Promise.resolve()
            // .then(() => this._client.wallet.getAccount())
            // .then(acc => acc.isReady())
            .then(() => this._pollTimeout = setTimeout(() => this._poll(), 0)) // first poll is immediate
            .then(() => ({handle: displayname}))
            .catch(e => console.log("error", e));
        return this.initialized
    }

    /** _poll is async, if we used an interval we might start a new poll before
     * the last one was done. that's why _poll sets up the next poll after it's done.
     */
    async _poll() {
        console.log("poll new messages since", this._lastPollTime)
        this._pollTimeout = null
        const pollTime = this._lastPollTime
        this._lastPollTime = Date.now()

        // TODO: it should be possible to do this per session / chat partner.
        const messages = await dapiFacade.get_messages_by_time(this._connection, pollTime)
        const messagePromises = messages.map(
            m => this._broadcastNewMessage(m)
                .catch(() => console.log('failed to broadcast message:', m))
        )
        await Promise.all(messagePromises);

        this._pollTimeout = setTimeout(() => this._poll(), pollInterval)
    }

    async _broadcastNewMessage(rawMessage) {
        const ownerId = rawMessage.ownerId.toString();
        const timestamp = Number(rawMessage.createdAt);

        // TODO: put content through the signal lib
        const content = rawMessage.data.content;
        // TODO: get senderHandle from (some) public profile!
        const senderHandle = ownerId;

        // make sure we have the sender in our sessions
        const session = await this._getOrCreateSession(ownerId, senderHandle);
        // TODO: remove. only here because storage doesn't know if it's
        // TODO: busy and breaks if new-message comes right after new-session
        await new Promise(r => setTimeout(r, 1000));

        this.emit('new-message', {content, timestamp, senderHandle}, session);

        // TODO: this probably misses some messages?
        // TODO: intention is to set next poll up for right after
        // TODO: the newest message
        this._lastPollTime = Math.min(this._lastPollTime, timestamp + 1);
    }

    async _getOrCreateSession(ownerId, senderHandle) {
        let session;
        if (this._sessions[ownerId] == null) {
            session = {handle: senderHandle, ownerId};
            this._sessions[ownerId] = session;
            // TODO: get signal keys for a new session
            // make sure storage knows about the new session
            this.emit('new-session', session);
        } else {
            session = this._sessions[ownerId];
        }
        return session;
    }

    /**
     * TODO: instead of indefinitely awaiting init, set
     * TODO: timeout and reject after some amount
     * TODO: of time and mark message for retry in GUI
     * @param receiver
     * @param content
     * @returns {Promise<boolean>}
     */
    async sendMessage(receiver, content /*, keybundle */) {

        // TODO: Hier kommt der Signalkram rein -> enc msg
        // TODO: keybundle soll der messenger sich selbst beschaffen,
        // TODO: muss nicht als arg kommen.

        await this.initialized
        const rawMsg = await dapiFacade.create_message(this._connection, receiver, content)

        console.log(rawMsg)
        // GUI listens to this, can then remove send-progressbar or w/e
        // storage also listens and will save the message.
        this.emit('new-message', {
            senderId: this._connection.identity.toString(),
            content,
            timestamp: Date.now() // TODO: does create_message return the message? maybe we can use that timestamp.
        }, {handle: receiver})
    }

    getSessions() {
        return this._sessions
    }

    disconnect() {
        clearTimeout(this._pollTimeout)
        this._pollTimeout = null
    }
}

module.exports = WhatsDapp;