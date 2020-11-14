const {aesDecryptObject, getIdentityIDHash} = require("../crypt");
const {getTargetChunkIndex, readJSON} = require('../utils')
const {DEFAULT_MSG_COUNT} = require('../constants')
const path = require('path')

/**
 * constructs methods to return the next x / previous x messages from a timestamp.
 *
 * @param older {boolean} whether to return messages older or newer than the timestamp.
 */
module.exports = (older) => {

    // if we want older messages, the first message we could possibly return is the newest one.
    // if we want newer, it's the oldest message.
    const timestampDefault = older
        ? Infinity
        : 0

    // if we want older than timestamp, the timestamp of the returned messages has to be smaller
    // than the qery timestamp.
    const comparer = older
        ? (mt, qt) => mt > qt
        : (mt, qt) => mt < qt

    // if we want older than timestamp, we need to inspect the newest message in chunk first.
    const reverser = older
        ? arr => arr.reverse()
        : arr => arr

    // if we want older than timestamp, we need to iterate the chunks from the end.
    const dir = older
        ? -1
        : 1

    return function (identityId, timestamp = timestampDefault, limit = DEFAULT_MSG_COUNT) {
        console.log("retrieve msg for", identityId)
        // prepare array of Promises that can be returned immediately
        const resolves = []
        const ret = []
        if (limit <= 0 || timestamp < 0) return []
        for (let i = 0; i < limit; i++) {
            ret.push(new Promise(res => resolves.push(res)))
        }
        const chunks = this._metadata[identityId].chunks
        const targetChunkIndex = getTargetChunkIndex(timestamp, chunks)
        const hashId = getIdentityIDHash(identityId, this._salt)
            // this is started immediately and will resolve sequentially
            // without blocking this function call (think subroutine)
        ;(async () => {
            await this.initialized
            // run through the chunks until we can't find messages anymore
            // or we fulfilled limit
            const stopVal = dir > 1
                ? chunks.length
                : -1
            for (let i = targetChunkIndex; i !== stopVal; i = i + dir) {
                // read in chunk contents
                const chunkPath = path.join(this._storagePath, hashId, i.toString())
                const encChunk = await readJSON(chunkPath)
                // encChunk is an array of b64 encoded, encrypted message objects
                const decChunk = encChunk.map(m => aesDecryptObject(Buffer.from(m, 'base64'), this._key))
                reverser(decChunk).forEach(message => {
                    if (comparer(message.timestamp, timestamp)) {
                        console.log('message in wrong time slice')
                        return
                    }
                    // resolve the first unresolved promise with this message.
                    resolves.shift()(message)
                })
                if (resolves.length === 0) break;
            }

            // if there are still unresolved promises, we didn't have enough messages.
            resolves.forEach(r => r(null))
        })()

        return ret
    }
}