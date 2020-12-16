module.exports = async function getUserData() {
    await this.initialized
    return this._userdata
}
