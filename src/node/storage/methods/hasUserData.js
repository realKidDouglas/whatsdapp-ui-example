module.exports = async function hasUserData() {
    await this.initialized
    const usr = this._userdata;
    let mnc, id, dpns, dn;
    if(usr) {
        mnc = usr.mnemonic;
        id = usr.identityAddr;
        dpns = usr.dpnsName;
        dn = usr.displayName;
    }
    return (
        mnc !== undefined &&
        id !== undefined &&
        dpns !== undefined &&
        dn !== undefined
    )
}
