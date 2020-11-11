const {readJSON} = require('../utils')
const {MAP_FILE_NAME} = require('../constants')
const {getIdentityIDHash, aesDecryptObject} = require('../crypt')
const path = require('path')
const fs = require('fs-extra')


/**
 * print all messages in a session for debug purpose
 * @param identityId
 * @returns {Promise<void>}
 */
module.exports = async function printSession(identityId) {
    await this.initialized
    const p = path.join(this._storagePath, getIdentityIDHash(identityId, this._salt))
    const files = (await fs.readdir(p))
        .filter(f => f !== MAP_FILE_NAME)
        .map(Number)
        .sort()
        .map(n => n.toString())
    const contents = (await Promise.all(files.map(f => readJSON(path.join(p, f)))))
        .reduce((a, c) => a.concat(c), [])
        .map(s => aesDecryptObject(Buffer.from(s, 'base64'), this._key))
    const isSorted = contents
        .map(c => c.timestamp)
        .reduce((a, c) => {
            if (a && a <= c) {
                return c
            } else {
                console.log("unsorted at", c - 1605051000000)
                return false
            }
        }, 1)
    contents.forEach((m, i) => console.log(m.timestamp - 1605051000000, i))
    console.log("is sorted:", !!isSorted)
}
