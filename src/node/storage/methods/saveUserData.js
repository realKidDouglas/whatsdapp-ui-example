const {USER_FILE_NAME} = require('../constants')
const {aesEncryptObject} = require('../crypt')
const path = require('path')
const fs = require('fs-extra')

/**
 * TODO: comment
 * @returns {Promise<void>}
 */
module.exports = async function saveUserData() {
    console.log("save user data")
    const udPath = path.join(this._storagePath, USER_FILE_NAME)
    const buf = aesEncryptObject(this._userdata, this._key)
    // make map file, creates parent dir if it doesn't exist
    return fs.outputFile(udPath, buf)
}
