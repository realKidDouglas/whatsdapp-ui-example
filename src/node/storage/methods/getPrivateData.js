module.exports = function getPrivateData() {
    await this.initialized
    return this._privatedata
}
