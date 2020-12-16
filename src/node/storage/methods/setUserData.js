module.exports = async function setUserData(data) {
    await this.initialized
    this._userdata = data
    return this._saveUserData()
}
