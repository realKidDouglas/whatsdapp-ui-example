const ab2str = require('arraybuffer-to-string')
const libsignal = require('libsignal')
const SignalProtocolStore = require('../SignalProtocolStoreWrapper')

module.exports = async function encryptMessage(whatsDappStore, sender, cipherText) {
    const store = new SignalProtocolStore(whatsDappStore, sender)
    var sessionCipher = await store.loadSession(sender);
    var messageHasEmbeddedPreKeyBundle = cipherText.type == 3;

    let plaintext
    if (messageHasEmbeddedPreKeyBundle) {
        plaintext = await sessionCipher.decryptPreKeyWhisperMessage(cipherText.body, 'binary');
    } else {
        plaintext = await sessionCipher.decryptWhisperMessage(cipherText.body, 'binary');
    }
    return ab2str(plaintext, 'binary');
}
