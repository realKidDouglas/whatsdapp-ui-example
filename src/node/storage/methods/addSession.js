const {getIdentityIDHash} = require('../crypt')
const {outputJSON} = require('../utils')
const path = require('path')

/**
 * add a new session to the store
 * new sessions need
 * @param identityId the identityId this session is for
 * @param info the session metadata
 */
module.exports = async function addSession(identityId, info) {
    await this.initialized
    console.log("adding session!")
    // update in-memory metadata store
    this._metadata[identityId] = {
        chunks: [0], // the first file contains all messages from unix epoch
        info: info, // the session keys (signal)
    }
    // create first hist file (empty)
    const idHash = getIdentityIDHash(identityId, this._salt)
    const histPath = path.join(this._storagePath, idHash, "0")
    await outputJSON(histPath, [])

    // save to disk
    return this._saveMetaData(identityId, idHash)
}