module.exports = async function setPrivateData(data) {
    await this.initialized
    this._privatedata = data
    return this._savePrivateData()
}
