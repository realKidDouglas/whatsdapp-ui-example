

function SignalWrapper() {
    this.generateSignalKeys = require('./methods/generateSignalKeys.js')
    //this.createSignalProtocolStoreWrapper('./methods/createSignalProtocolStoreWrapper.js')
    this.encryptMessage = require('./methods/encryptMessage.js')
    this.decryptMessage = require('./methods/decryptMessage.js')
    this.buildAndPersistSession = require('./methods/buildAndPersistSession.js')
    this._generatePreKey = require('./methods/generatePreKey.js')
    this._generateSignedPreKey = require('./methods/generateSignedPreKey.js')
}

module.exports = SignalWrapper;
