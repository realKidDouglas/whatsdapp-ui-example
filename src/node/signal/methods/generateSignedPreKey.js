const libsignal = require('libsignal');

module.exports = async function generateSignedPreKey(identityKeyPair) {
    const signedPreKeyId = 1337; // TODO: replace
    return libsignal.keyhelper.generateSignedPreKey(identityKeyPair, signedPreKeyId);
}
