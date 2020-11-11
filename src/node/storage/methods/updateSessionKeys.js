/**
 *
 * @param identityId {string} session to update
 * @param info {any} signal state for the session
 * @returns {Promise<void>}
 */
module.exports = async function updateSessionKeys(identityId, info) {
    await this.initialized
    if (this._metadata[identityId] == null) throw new Error("could not update session keys, session not found!")
    this._metadata[identityId].info = info
    return this._saveMetaData(identityId)
}