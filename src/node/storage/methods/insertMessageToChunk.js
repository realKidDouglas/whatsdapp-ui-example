const {aesDecryptObject} = require('../crypt')

/**
 *
 * @param timestamp {number}
 * @param newEntry {string}
 * @param histChunk {Array<string>}
 * @return {Array<string>}
 * @private
 */
module.exports = function _insertMessageToChunk(timestamp, newEntry, histChunk) {
    let i
    // find first timestamp from the end that's smaller than our new timestamp
    for (i = histChunk.length - 1; i >= 0; i--) {
        const msg = aesDecryptObject(Buffer.from(histChunk[i], 'base64'), this._key)
        if (msg.timestamp < timestamp) break;
    }
    histChunk.splice(i + 1, 0, newEntry)
    return histChunk
}