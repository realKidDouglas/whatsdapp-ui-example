const str2ab = require('string-to-arraybuffer')
const libsignal = require('libsignal')
const SignalProtocolStore = require('../SignalProtocolStoreWrapper')

module.exports = async function encryptMessage(whatsDappStore, receiver, plaintext) {
    const store = new SignalProtocolStore(whatsDappStore, receiver)
    var sessionCipher = await store.loadSession(receiver);
    var cipherText = await sessionCipher.encrypt(str2ab(message));
    return cipherText;
}