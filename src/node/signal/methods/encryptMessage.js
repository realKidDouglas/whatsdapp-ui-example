const str2ab = require('string-to-arraybuffer')
const libsignal = require('libsignal')
const SignalProtocolStore = require('../SignalProtocolStoreWrapper')

module.exports = async function encryptMessage(whatsDappStore, receiverId, plaintext) {
    const deviceId = 1 // TODO: This shouldn't be hardcoded
    const store = new SignalProtocolStore(whatsDappStore, receiverId)
    var address = new libsignal.ProtocolAddress(receiverId, deviceId);
    var sessionCipher = new libsignal.SessionCipher(store, address)
    const plaintextBuffer = new Buffer.from(plaintext)
    const cipherText = await sessionCipher.encrypt(plaintextBuffer)
    const base64 = Buffer.from(JSON.stringify(cipherText)).toString("base64");
    return base64;
}