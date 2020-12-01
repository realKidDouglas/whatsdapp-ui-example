module.exports = async function hasPrivateSignalKeys() {
    await this.initialized
    const ikp = this._privatedata.identityKeyPair
    const rid = this._privatedata.registrationId
    const pk  = this._privatedata.preKey
    const spk = this._privatedata.signedPreKey
    return (
        ikp !== undefined &&
        rid !== undefined &&
        pk  !== undefined &&
        spk !== undefined
    )
}
