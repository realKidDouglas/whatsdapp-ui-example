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
    const idHash = getIdentityIDHash(identityId, this._salt)
    const pathToDelete = path.join(this._storagePath, idHash)
    delete this._metadata[identityId]
    await fs.remove(pathToDelete)
    return this._saveMetaData(identityId, idHash)
}
