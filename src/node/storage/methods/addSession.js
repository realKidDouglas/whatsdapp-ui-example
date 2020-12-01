const {getIdentityIDHash} = require('../crypt')
const {outputJSON} = require('../utils')
const path = require('path')

/**
 * add a new session to the store
 * new sessions need
 * @param identityId the identityId this session is for
 * @param info the session metadata
 */
module.exports = async function addSession(identityId, deviceString, info) {
    await this.initialized
    let resolve
    const p = new Promise(r => resolve = r)

    const handler = async (identityId, deviceString, info) => {
        console.log("adding session!")
        // update in-memory metadata store
        this._metadata[identityId] = {
            chunks: [0], // the first file contains all messages from unix epoch
            info: {
                [deviceString]: info
            } // the session keys (signal)
        }
        // create first hist file (empty)
        const idHash = getIdentityIDHash(identityId, this._salt)
        const histPath = path.join(this._storagePath, idHash, "0")
        await outputJSON(histPath, [])

        // save to disk
        await this._saveMetaData(identityId, idHash)
        resolve()
    }

    this._pendingRequests.push(() => handler(identityId, deviceString, info))
    return p
}