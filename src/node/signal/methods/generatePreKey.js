const libsignal = require('libsignal');

module.exports = async function generatePreKey() {
    const preKeyId = 42; // TODO: replace
    return libsignal.keyhelper.generatePreKey(preKeyId);
}
