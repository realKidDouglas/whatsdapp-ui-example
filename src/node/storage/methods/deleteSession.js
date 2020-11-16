const {getIdentityIDHash} = require("../utils")
const fs = require('fs-extra')
const path = require('path')
/**
 * delete session metadata and
 * associated files
 * @param identityId conversation partner whose convo is to be deleted
 */
module.exports = async function deleteSession(identityId) {
    await this.initialized
    let resolve
    const p = new Promise(r => resolve = r)

    const handler = async (identityId) => {
        const idHash = getIdentityIDHash(identityId, this._salt)
        const pathToDelete = path.join(this._storagePath, idHash)
        delete this._metadata[identityId]
        await fs.remove(pathToDelete)
        await this._saveMetaData(identityId, idHash)
        resolve()
    }

    this._pendingRequests.push(() => handler(identityId))
    return p
}
