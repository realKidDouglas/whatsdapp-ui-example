const {getTargetChunkIndex, getFileSize, outputJSON} = require("../utils")
const {aesEncryptObject, getIdentityIDHash} = require("../crypt")
const {CHUNK_SIZE_SOFT_MAX, CHUNK_SIZE_MAX, CHUNK_SIZE_BUF} = require('../constants')
const path = require('path')
const fs = require('fs-extra')

/**
 * add a message to a session. messages are stored in a series of json files, that
 * each contain about maxHistFileSize bytes of encrypted messages.
 * @param identityId {string}
 * @param message {{timestamp: number, message: string}} in plain text
 * @returns {Promise<void>}
 */
module.exports = async function addMessageToSession(identityId, message) {
    await this.initialized
    if (this._metadata[identityId] == null) {
        console.log("session not found, can't add message")
        return
    }
    const idHash = getIdentityIDHash(identityId, this._salt)
    const sessionPath = path.join(this._storagePath, idHash)
    const timestamp = message.timestamp
    const newEntry = aesEncryptObject(message, this._key).toString('base64')
    const newEntryLength = Buffer.byteLength(newEntry, 'utf8')
    // sorted list of the first message time stamp in each hist file for this session
    const chunks = this._metadata[identityId].chunks
    const targetChunkIndex = getTargetChunkIndex(timestamp, chunks)
    let histFilePath = path.join(sessionPath, targetChunkIndex.toString())
    if (targetChunkIndex === chunks.length - 1) { // it's the last one
        const currentFileSize = getFileSize(histFilePath)
        // if the first file is empty, we can still put a message in there even if it's too big
        if (currentFileSize > CHUNK_SIZE_BUF && currentFileSize + newEntryLength + CHUNK_SIZE_BUF > CHUNK_SIZE_SOFT_MAX) {
            histFilePath = path.join(sessionPath, (targetChunkIndex + 1).toString())
            this._metadata[identityId].chunks.push(timestamp)
            const histChunk = [newEntry]
            await outputJSON(histFilePath, histChunk)
        } else {
            const histChunk = await fs.readJSON(histFilePath)
            await outputJSON(
                histFilePath,
                this._insertMessageToChunk(timestamp, newEntry, histChunk)
            )
        }
    } else {
        // it's a delayed message, add to the found histFile and check afterwards if hardMaxSize was exceeded
        let histChunk = await fs.readJSON(histFilePath)
        histChunk = this._insertMessageToChunk(timestamp, newEntry, histChunk)
        const json = JSON.stringify(histChunk)
        await fs.outputFile(histFilePath, json)
        if (Buffer.byteLength(json, 'utf8') > CHUNK_SIZE_MAX) await this._reorganizeHistory(identityId)
    }

    return this._saveMetaData(identityId, idHash)
}