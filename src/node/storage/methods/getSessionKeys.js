/**
 * retrieve session metadata (signal keys) for the
 * conversation with identityId
 * @param identityId conversation partner we need the keys for
 * @returns {Promise<any>}
 */
module.exports = async function getSessionKeys(identityId) {
    await this.initialized
    return this._metadata[identityId].info
}