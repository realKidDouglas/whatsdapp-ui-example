const {MAP_FILE_NAME} = require('../constants')
const {getIdentityIDHash, aesEncryptObject} = require('../crypt')
const path = require('path')
const fs = require('fs-extra')

/**
 * save current state of metadata for convo with identityId to disk
 * @param identityId
 * @param idHash {string?}
 * @returns {Promise<void>}
 */
module.exports = async function _saveMetaData(identityId, idHash) {
    console.log("save metadata")
    const md = this._metadata[identityId]
    if (!idHash) idHash = getIdentityIDHash(identityId, this._salt)
    const mdPath = path.join(this._storagePath, idHash, MAP_FILE_NAME)
    const contents = {
        identityId,
        info: md.info,
        chunks: md.chunks
    }
    const buf = aesEncryptObject(contents, this._key)
    // make map file, creates parent dir if it doesn't exist
    return fs.outputFile(mdPath, buf)
}