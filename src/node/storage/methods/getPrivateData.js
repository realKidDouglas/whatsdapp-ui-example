module.exports = async function getPrivateData() {
    await this.initialized
    return this._privatedata
}
