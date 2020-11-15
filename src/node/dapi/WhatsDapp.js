const Client = require('./Client').Client;
const dapiFacade = new (require('./DAPI_Facade').DAPI_Facade)();
const EventEmitter = require('events');

const timeout = 5000

class WhatsDapp extends EventEmitter {

    constructor() {
        super();
        this._connection = {
            identity: null,
            platform: null
        }

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

        if(identity == null) {
            let id = await dapiFacade.create_identity(this._connection);
            identity = id.getId().toJSON();
            console.log(identity)
        }

        await this._connection.identity = await this._connection.platform.identities.get(identity);
        let profile = await dapiFacade.get_profile(this._connection, identity);

        if(profile == null) {
            console.log("creating new profile!");
            let content = {
                identity_public_key: "Kommt später",
                signed_identity_public_key: "Kommt später",
                prekeys: ["kommt", "später"],
                displayname: options.displayname,
            };
            await dapiFacade.create_profile(this._connection, content);
            profile = await dapiFacade.get_profile(this._connection, identity);
        }

        // deferred initialization
        this.initialized = Promise.resolve()
            .then(() => this._pollTimeout = setTimeout(() => this._poll(), timeout))
            .then(() => this._client.wallet.getAccount())
            .then(acc => acc.isReady());

        // this is what is assigned to loggedInUser in App.js, not sure what else it expects
        return {handle: displayname}
    }

    // poll is async, if we used an interval we might start a new poll before
    // the last one was done.
    // TODO: split up!
    async _poll() {
        this._pollTimeout = null
        console.log("poll")
        // TODO: poll each session in this._sessions & look
        // TODO: for new initial messages (adding sessions as required)
        // dummy work (sleep)
        await new Promise(r => setTimeout(r, 1000))

        const newSession = {handle: 'robsenwhats'}
        if (!this._sessions['robsenwhats']) {
            this._sessions['robsenwhats'] = newSession
            this.emit('new-session', newSession)
        }

        // TODO: remove. only here because storage doesn't know if it's
        // TODO: busy and breaks if new-message right after new-session
        await new Promise(r => setTimeout(r, 1000))

        this.emit('new-message', {
            senderHandle: "robsenwhats",
            timestamp: Date.now(),
            content: "Dies ist eine nachricht von robin"
        }, newSession)

        this._pollTimeout = setTimeout(() => this._poll(), timeout)
    }

    /**
     * TODO: instead of indefinitely awaiting init, set
     * TODO: timeout and reject/return false after some amount
     * TODO: of time and mark message for retry in GUI
     * @param receiver
     * @param message
     * @returns {Promise<boolean>}
     */
    async sendMessage(receiver, message /*, keybundle */) {

        // TODO: Hier kommt der Signalkram rein -> enc msg
        // TODO: keybundle soll der messenger sich selbst beschaffen,
        // TODO: muss nicht als arg kommen.

        await this.initialized
        await dapiFacade.message_DAO.create_message(this._connection, receiver, content)

        // GUI listens to this, can the remove spinner or w/e
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
}

module.exports = WhatsDapp;