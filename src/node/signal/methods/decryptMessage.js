const ab2str = require('arraybuffer-to-string')
const libsignal = require('libsignal')
const SignalProtocolStore = require('../SignalProtocolStoreWrapper')

module.exports = async function decryptMessage(whatsDappStore, senderId, base64) {
    if (base64 == "hallo")
        return base64
    const cipherText = JSON.parse(Buffer(base64, 'base64').toString('ascii'))
    const deviceId = 1 // TODO: This shouldn't be hardcoded
    const store = new SignalProtocolStore(whatsDappStore, senderId)
    const address = new libsignal.ProtocolAddress(senderId, deviceId);
    var sessionCipher = new libsignal.SessionCipher(store, address)

    const messageHasEmbeddedPreKeyBundle = cipherText.type == 3;

    let plaintext
    if (messageHasEmbeddedPreKeyBundle) {
        plaintext = await sessionCipher.decryptPreKeyWhisperMessage(Buffer.from(cipherText.body.data), 'binary');
    } else {
        plaintext = await sessionCipher.decryptWhisperMessage(Buffer.from(cipherText.body.data), 'binary');
    }
    return ab2str(plaintext, 'binary');
}
