/**
 * get the list of identityIds we currently have convos with
 * @returns {Promise<string[]>}
 */
module.exports = async function getSessions() {
    await this.initialized
    return Object.keys(this._metadata)
}