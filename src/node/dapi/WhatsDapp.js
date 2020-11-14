const dapiFacade = new (require('./DAPI_Facade').DAPI_Facade)();
const EventEmitter = require('events');
const {Connection} = require("./Connection");

const timeout = 5000

class WhatsDapp extends EventEmitter {

    constructor() {
        super();

    }

    /**
     * @param opts {{mnemonic: string, sessions: Array<{signal: any, identity_receiver: string, profile_name: string}>}}
     * @returns {Promise<{handle:string}>}
     */
    async connect(opts) {
        const {mnemonic, sessions} = opts;
        this._sessions = sessions;
        this._connection = new Connection(mnemonic);

        // deferred initialization
        this.initialized = Promise.resolve()
            .then(() => this._pollTimeout = setTimeout(() => this._poll(), timeout))
            .then(() => this._connection.client.wallet.getAccount())
            .then(acc => acc.isReady());

        // this is what is assigned to loggedInUser in App.js, not sure what else it expects
        return {handle: "MegaNick"}
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
        await new Promise(r=>setTimeout(r, 1000))

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
    async sendMessage(receiver, message) {
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