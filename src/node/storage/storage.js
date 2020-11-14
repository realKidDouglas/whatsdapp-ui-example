const {getMetaData} = require('./utils.js')
const {getKey, getSalt} = require('./crypt')

/**
 * Example implementation of a WhatsDapp storage provider for node/electron
 *
 * stores information in a directory that's configured with the constructor
 * options.
 * the directory will contain one subdirectory per session, named after the hex-encoding of
 * a 16 byte scrypt 'hash' of the identityID of the conversation partner.
 *
 * # session storage
 * to store session metadata, each directory contains a map.blk file that contains the current
 * signal state for the session and a list of timestamps that maps the numbered chunk files onto the message
 * history time ranges contained within.
 *
 * # message storage
 * the subdirectories contain one file per ~100kB of messages, each message encrypted with
 * the storage aes-256-gcm master key and a random IV
 *
 * each json document contains a binary encoded json list of the messages sorted from old to new
 *
 * the json documents are sequentially numbered for each session.
 * @param opts {{storagePath: string, password: string | Uint8Array}}
 * @constructor
 */
function WhatsDappNodeStorage(opts) {
    if (!opts.storagePath) throw new Error('storage opts need a string path to a directory')
    if (!opts.password) throw new Error('storage opts need a password to encrypt the storage')
    const {storagePath, password} = opts

    // set up lifetime constants
    this._storagePath = storagePath
    this._salt = getSalt(storagePath)
    this._key = getKey(password, this._salt)

    // deferred initialization
    this.initialized = Promise.resolve()
        .then(() => getMetaData(this._storagePath, this._key))
        .then(md => this._metadata = md)
        .then(() => console.log("storage metadata:", this._metadata)) // TODO: remove.
        .catch(e => console.error('could not initialize whatsdapp storage:', e))

    // methods
    this.getSessions = require('./methods/getSessions.js')
    this.getSessionKeys = require('./methods/getSessionKeys.js')
    this.updateSessionKeys = require('./methods/updateSessionKeys.js')
    this.addSession = require('./methods/addSession.js')
    this.addMessageToSession = require('./methods/addMessageToSession.js')
    this.deleteSession = require('./methods/deleteSession.js')
    this.printSession = require('./methods/printSession.js')
    /**
     * return a list of promises of messages, starting at a timestamp.
     * will not return a message that was sent exactly at timestamp.
     *
     * usage: to get the next chunk of messages when the user is scrolling up,
     * simply call this with the timestamp of the oldest message that's currently loaded.
     *
     * if there are not enough messages to return, remaining promises will be resolved with null.
     *
     * @type {function(identityId: string, timestamp: ?number, limit: ?number):Array<Promise<?{timestamp: number, message: string}>>}
     */
    this.getPreviousMessages = require('./methods/getMessagesByTimestamp.js')(true)
    /**
     * return a list of promises of messages, starting at a timestamp.
     * will not return a message that was sent exactly at timestamp.
     *
     * usage: to get the next chunk of messages when the user is scrolling down
     * simply call this with the timestamp of the newest message that's currently loaded.
     *
     * if there are not enough messages to return, remaining promises will be resolved with null.
     *
     * @type {function(identityId: string, timestamp: ?number, limit: ?number):Array<Promise<?{timestamp: number, message: string}>>}
     */
    this.getNextMessages = require('./methods/getMessagesByTimestamp.js')(false)

    // privates
    this._saveMetaData = require('./methods/saveMetaData.js')
    this._insertMessageToChunk = require('./methods/insertMessageToChunk.js')
    this._reorganizeHistory = require('./methods/reorganizeHistory.js')
}


module.exports = WhatsDappNodeStorage