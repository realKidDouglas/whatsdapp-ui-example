const crypto = require('crypto')
const fs = require('fs-extra')
const path = require('path')
const {SALT_FILE_NAME, IV_LENGTH, ALGO, TAG_LENGTH, SALT_LENGTH} = require('./local_storage_constants')

/**
 * decrypt a Uint8Array
 * @param buf {Buffer}
 * @param key {Buffer}
 * @returns {Uint8Array | null}
 */
function aesDecryptUint8Array(buf, key) {
    try {
        const iv = buf.slice(0, IV_LENGTH)
        const tag = buf.slice(IV_LENGTH, IV_LENGTH + TAG_LENGTH)
        const ct = buf.slice(IV_LENGTH + TAG_LENGTH)
        const decipher = crypto.createDecipheriv(ALGO, key, iv, {authTagLength: TAG_LENGTH})
        decipher.setAuthTag(tag)
        return Buffer.concat([decipher.update(ct), decipher.final()])
    } catch (e) {
        console.log('could not decipher array!', e)
        return null
    }
}

/**
 * encrypt a Uint8Array
 * @param arr {Uint8Array}
 * @param key {Buffer}
 * @returns {Buffer} iv | authTag | ciphertext
 */
function aesEncryptUint8Array(arr, key) {
    const iv = crypto.randomBytes(IV_LENGTH)
    const cipher = crypto.createCipheriv(ALGO, key, iv)
    const ctBuffers = []
    ctBuffers.push(cipher.update(Buffer.from(arr)))
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
 * file names.
 * @param storageKey {string}
 * @param saltBuffer {Buffer} salt used for the scrypt hash
 * @returns {string} hex encoded hash
 */
function getStorageKeyHash(storageKey, saltBuffer) {
    // if(typeof input !== 'string' || input.length !== X) throw new Error('invalid identity id')
    return crypto.scryptSync(storageKey, saltBuffer, 16, {
        cost: 16384, // default
        blockSize: 8, // default
        parallelization: 1, // default
        maxmem: 32 * 1024 * 1024 //default
    }).toString('hex')
}

module.exports = {
    getSalt,
    getKey,
    getStorageKeyHash,
    aesDecryptUint8Array,
    aesEncryptUint8Array,
}