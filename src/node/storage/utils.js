const fs = require('fs-extra')
const path = require('path')
const {MAP_FILE_NAME, SALT_FILE_NAME, PRIVATE_FILE_NAME} = require('./constants')
const {aesDecryptObject} = require('./crypt')


function getFileSize(file) {
    const stats = fs.statSync(file)
    return stats.size
}

function outputJSON(p, o) {
    return fs.outputJSON(p, o, {spaces: 2})
}

function readJSON(p) {
    return fs.readJSON(p)
}

function stringByteLength(s) {
    return Buffer.byteLength(s, 'utf8')
}

/**
 * get a chunk a timestamp would lie in. assumes that
 * the first chunk starts at 0.
 * @param timestamp {number} timestamp to sort
 * @param chunks {Array<number>} array of timestamps
 * @returns {number} index of the last chunk that starts
 * before the timestamp.
 */
function getTargetChunkIndex(timestamp, chunks) {
    return chunks.reduce((best, cur, i) => cur < timestamp ? i : best, 0)
}


/**
 * retrieve & decrypt the stored metadata for all sessions.
 * each metadata file contains an object of the form
 * {identityId: string, chunks: [number], keys: object}
 *
 * the collection will be returned as a map as follows:
 * {[identityId: string]: {chunks: [number], keys: object}}
 *
 * so message retrieval/storage can be queried by identityId of convo partner.
 *
 * @param {string} storagePath
 * @param {Buffer} key
 * @returns {Promise<any>}
 */
async function getMetaData(storagePath, key) {
    try {
        console.log("getting metadata!")
        // get the session dirs
        const sessionDirs = (await fs.readdir(storagePath)).filter(f => (f !== SALT_FILE_NAME && f !== PRIVATE_FILE_NAME))
        // try to read metadata in parallel
        // after we read each file, execution can be sequential again
        // because node is single-thread
        const sessionInfoPromises = sessionDirs
            .map(d => fs.readFile(path.join(storagePath, d, MAP_FILE_NAME)))

        const sessionInfoBuffers = await Promise.all(sessionInfoPromises)
        return sessionInfoBuffers
            .map(b => aesDecryptObject(b, key))
            .filter(b => b != null)
            .reduce((r, o) => Object.assign(r, {[o.identityId]: {info: o.info, chunks: o.chunks}}), {})
    } catch (e) {
        console.log("can't get metadata:", e)
        return {}
    }
}

async function getPrivateData(storagePath, key) {
    try {
        console.log("getting private data!")
        if (fs.existsSync(path.join(storagePath, PRIVATE_FILE_NAME))) {
            const ownDataBuf = await fs.readFile(path.join(storagePath, PRIVATE_FILE_NAME))
            return aesDecryptObject(ownDataBuf, key)
        } else {
            return {}
        }
    } catch(err) {
        console.error("can't get own data:", e)
        return {}
    }
}

module.exports = {
    getTargetChunkIndex,
    stringByteLength,
    outputJSON,
    readJSON,
    getFileSize,
    getMetaData,
    getPrivateData
}
