const libsignal = require('libsignal')
const SignalProtocolStore = require('../SignalProtocolStoreWrapper')

module.exports = async function buildAndPersistSession(whatsDappStore, identifier, preKeyBundle) {
    const deviceId = 1 // TODO: This shouldn't be hardcoded
    const store = new SignalProtocolStore(whatsDappStore, identifier)
    var address = new libsignal.ProtocolAddress(identifier, deviceId);
    var sessionBuilder = await new libsignal.SessionBuilder(store, address);
    await sessionBuilder.initOutgoing(preKeyBundle);
}
