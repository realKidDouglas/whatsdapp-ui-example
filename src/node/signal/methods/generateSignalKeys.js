const libsignal = require('libsignal');

module.exports = async function generateSignalKeys() {
    const identityKeyPair = await libsignal.keyhelper.generateIdentityKeyPair();
    const registrationId = await libsignal.keyhelper.generateRegistrationId();
    const preKey = await this._generatePreKey();
    const signedPreKey = await this._generateSignedPreKey(identityKeyPair);
    return {
        private: {
            identityKeyPair: identityKeyPair,
            registrationId: registrationId,
            preKey: preKey,
            signedPreKey: signedPreKey
        },
        preKeyBundle: {
            identityKey: identityKeyPair.pubKey,
            registrationId: registrationId,
            preKey: {
                keyId: preKey.keyId,
                publicKey: preKey.keyPair.pubKey
            },
            signedPreKey: {
                keyId: signedPreKey.keyId,
                publicKey: signedPreKey.keyPair.pubKey,
                signature: signedPreKey.signature
            }
        }
    };
}
