const crypto = require('crypto')
const fs = require('fs-extra')
const path = require('path')
const {SALT_FILE_NAME, IV_LENGTH, ALGO, TAG_LENGTH, SALT_LENGTH} = require('./constants')

/**
 * decrypt a buffer and parse js object
 * @param buf {Buffer}
 * @param key {Buffer}
 * @returns {?object}
 */
function aesDecryptObject(buf, key) {
    try {
        const iv = buf.slice(0, IV_LENGTH)
        const tag = buf.slice(IV_LENGTH, IV_LENGTH + TAG_LENGTH)
        const ct = buf.slice(IV_LENGTH + TAG_LENGTH)
        const decipher = crypto.createDecipheriv(ALGO, key, iv, {authTagLength: TAG_LENGTH})
        decipher.setAuthTag(tag)
        let plain = decipher.update(ct, null, 'utf8')
        plain += decipher.final('utf8')
        return JSON.parse(plain)
    } catch (e) {
        console.log('could not decipher object!', e)
        return null
    }
}

/**
 * encrypt a js object into a buffer
 * @param obj {object}
 * @param key {Buffer}
 * @returns {Buffer} iv | authTag | ciphertext
 */
function aesEncryptObject(obj, key) {
    const iv = crypto.randomBytes(IV_LENGTH)
    const cipher = crypto.createCipheriv(ALGO, key, iv)
    const ctBuffers = []
    ctBuffers.push(cipher.update(JSON.stringify(obj), 'utf8'))
    ctBuffers.push(cipher.final())
    const tag = cipher.getAuthTag()
    return Buffer.concat([iv, tag].concat(ctBuffers))
}


function getSalt(storagePath) {
    const saltPath = path.join(storagePath, SALT_FILE_NAME)
    let saltBuffer
    try {
        saltBuffer = fs.readFileSync(saltPath)
    } catch (e) {
        console.log('could not retrieve salt, generating new one.')
        saltBuffer = crypto.randomBytes(SALT_LENGTH)
        try {
            fs.outputFileSync(saltPath, saltBuffer)
        } catch (e) {
            console.log(`master salt could not be stored: ${saltBuffer.toString('hex')}\n\n`, e)
        }
    }
    if (!saltBuffer || saltBuffer.length === 0) throw new Error('something went wrong during master key derivation!')
    return saltBuffer
}

function getKey(password, saltBuffer) {
    return crypto.scryptSync(password, saltBuffer, 32, {
        cost: 16384, // default
        blockSize: 8, // default
        parallelization: 1, // default
        maxmem: 32 * 1024 * 1024 //default
    })
}

/**
 * fairly high cost is desired so if the storage gets leaked,
 * it's not easy to find out who we talked to by looking at the
 * directory names.
 * @param identityId
 * @param saltBuffer {Buffer} salt used for the scrypt hash
 * @returns {string}
 */
function getIdentityIDHash(identityId, saltBuffer) {
    // if(typeof input !== 'string' || input.length !== X) throw new Error('invalid identity id')
    return crypto.scryptSync(identityId, saltBuffer, 16, {
        cost: 16384, // default
        blockSize: 8, // default
        parallelization: 1, // default
        maxmem: 32 * 1024 * 1024 //default
    }).toString('hex')
}

module.exports = {
    aesDecryptObject,
    aesEncryptObject,
    getSalt,
    getKey,
    getIdentityIDHash
}