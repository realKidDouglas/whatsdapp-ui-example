module.exports = async function hasSession(identityId) {
    await this.initialized
    return (this._metadata[identityId] != undefined)
}
