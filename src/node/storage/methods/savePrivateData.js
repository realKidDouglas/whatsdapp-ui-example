const {PRIVATE_FILE_NAME} = require('../constants')
const {aesEncryptObject} = require('../crypt')
const path = require('path')
const fs = require('fs-extra')

/**
 * TODO: comment
 * @returns {Promise<void>}
 */
module.exports = async function savePrivateData() {
    console.log("save private data")
    const pdPath = path.join(this._storagePath, PRIVATE_FILE_NAME)
    const buf = aesEncryptObject(this._privatedata, this._key)
    // make map file, creates parent dir if it doesn't exist
    return fs.outputFile(pdPath, buf)
}
