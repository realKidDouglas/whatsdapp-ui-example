/**
 *
 * @param identityId {string} session to update
 * @param info {any} signal state for the session
 * @returns {Promise<void>}
 */
module.exports = async function updateSessionKeys(identityId, info) {
    await this.initialized
    let resolve
    const p = new Promise(r => resolve = r)

    const handler = async (identityId, info) => {
        if (this._metadata[identityId] == null) throw new Error("could not update session keys, session not found!")
        this._metadata[identityId].info = info
        await this._saveMetaData(identityId)
        resolve()
    }

    this._pendingRequests.push(() => handler(identityId, info))
    return p
}