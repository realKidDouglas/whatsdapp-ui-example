const Client = require('./Client').Client;
const dapiFacade = new (require('./DAPI_Facade').DAPI_Facade)();
const EventEmitter = require('events');
const {rawMessageToMessage, transitionToMessage} = require("./conversion");

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
            .then(() => ({handle: displayname, identity: identity}))
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

        const messagePromises = messages.map(m => this._broadcastNewMessage(m).catch(e => console.log('broadcast failed!', e)))
        console.log('got', messagePromises.length, 'new messages.')

        await Promise.all(messagePromises)

        this._pollTimeout = setTimeout(() => this._poll(), pollInterval)
    }

    async _broadcastNewMessage(rawMessage) {
        const message = rawMessageToMessage(rawMessage)
        const session = await this._getOrCreateSession(message.ownerId, message.senderHandle);
        this.emit('new-message', message, session);
        this._lastPollTime = Math.max(this._lastPollTime, message.timestamp + 1);
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
        const batch = await dapiFacade.create_message(this._connection, receiver, content)
        const message = transitionToMessage(batch.transitions[0], this._connection.identity)

        // GUI listens to this, can then remove send-progressbar or w/e
        // storage also listens and will save the message.
        this.emit('new-message', message, {handle: receiver})
    }

    getSessions() {
        return this._sessions
    }

    disconnect() {
        clearTimeout(this._pollTimeout)
        this._pollTimeout = null
    }

    async getProfileByName(name){
        let dpnsName = name + ".dash";


        let dpnsContract = await dapiFacade.find_identity_by_name(this._connection, dpnsName);
        if(dpnsContract == null){
            console.log("no identity found for " + name);
            return null;
        }

        let profileContract = await dapiFacade.get_profile(this._connection, dpnsContract.ownerId);
        if(profileContract == null){
            console.log("no WhatsDapp profile found for " + name);
            return null;
        }

        let profile = {
            identity: dpnsContract.ownerId.toString(),
            whatsDappName: profileContract.data.displayname,
            keybundle: {
                prekeys: profileContract.data.prekeys,
                identity_public_key: profileContract.data.identity_public_key,
                signed_identity_public_key: profileContract.data.signed_identity_public_key
            }
        }

        console.log(profile);
        return profile;
    }
}

module.exports = WhatsDapp;