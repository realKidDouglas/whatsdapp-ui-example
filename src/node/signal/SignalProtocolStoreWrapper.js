const ab2str = require('arraybuffer-to-string'); // Is there a better way than this?
const libsignal = require('libsignal');

function SignalProtocolStore(store, remoteIdentity) {
    this.store = store;
    this.remoteIdentity = remoteIdentity;
    this._getDeviceId = function(identifier) {
        let regexMatch = identifier.match(/.*\.(\d+)/)
        return (regexMatch != null) ? regexMatch[1] : -1
    }

    this.getOurIdentity = async function() {
        const privateData = await this.store.getPrivateData()
        return privateData['identityKeyPair']
    }
    this.getOurRegistrationId = function() {
        const privateData = this.store.getPrivateData()
        return privateData['registrationId']
    }
    this.isTrustedIdentity = function(identifier, identityKey, direction) {
        if (identifier === null || identifier === undefined) {
            throw new Error("tried to check identity key for undefined/null key");
        }
        if (!(identityKey instanceof Buffer)) {
            throw new Error("Expected identityKey to be an ArrayBuffer");
        }
        const trusted = this.store.getSessionKeys(identifier)['identityKey']
        if (trusted === undefined) {
            return Promise.resolve(true);
        }
        return Promise.resolve(ab2str(identityKey, 'binary') === ab2str(trusted, 'binary'));
    }
    this.loadIdentityKey = function(identifier) {
        if (identifier === null || identifier === undefined)
            throw new Error("Tried to get identity key for undefined/null key");
        return Promise.resolve(this.get('identityKey' + identifier));
    }
    this.saveIdentity = function(identifier, identityKey) {
        if (identifier === null || identifier === undefined)
            throw new Error("Tried to put identity key for undefined/null key");

        const address = libsignal.ProtocolAddress.from(identifier);
        // identifier is name.deviceId
        const deviceId = this._getDeviceId(identifier);
        const name = identifier.replace("." + deviceId, "");

        const existing = this.get('identityKey' + address.getName());
        let sessionKeys = store.getSessionKeys(name)
        sessionKeys['identityKey' + deviceId] = identityKey;
        store.updateSessionKeys(name, sessionKeys)

        if (existing && ab2str(identityKey, 'binary') !== ab2str(existing, 'binary')) {
            return Promise.resolve(true);
        } else {
            return Promise.resolve(false);
        }
    }

    this.loadPreKey = async function(keyId) {
        var res = (await this.store.getPrivateData()).preKey.keyPair
        return Promise.resolve(res);
    }
    this.storePreKey = async function(keyId, keyPair) {
        var privateData = await this.store.getPrivateData()
        privateData['preKey'] =  keyPair
        return Promise.resolve(this.store.setPrivateData(privateData));
    }
    this.removePreKey = async function(keyId) {
        var privateData = await this.store.getPrivateData()
        delete privateData['preKey']
        return Promise.resolve(this.store.setPrivateData(privateData));
    }

    this.loadSignedPreKey = async function(keyId) {
        var res = (await this.store.getPrivateData()).signedPreKey.keyPair
        return Promise.resolve(res);
    }
    this.storeSignedPreKey = function(keyId, keyPair) {
        return Promise.resolve(this.store.setPrivateData('signedPreKey_' + keyId, keyPair)['signedPreKey_' + keyId]);
    }
    this.removeSignedPreKey = function(keyId) {
        return Promise.resolve(this.remove('25519KeysignedKey' + keyId));
    }

    this.loadSession = async function(identifier) {
        let identityId
        let deviceString
        try {
            const address = libsignal.ProtocolAddress.from(identifier);
            identityId = address.id
            deviceString = "device" + address.deviceId
        } catch {
            identityId = identifier
            deviceString = "sessioncipher"
        }
        let result = await this.store.getSessionKeys(identityId, deviceString)
        if (deviceString == "sessioncipher") {
            result.storage = this
        }
        return result
    }
    this.storeSession = async function(identifier, record) {
        let identityId
        let deviceString
        try {
            const address = libsignal.ProtocolAddress.from(identifier);
            identityId = address.id
            deviceString = "device" + address.deviceId
        } catch {
            identityId = identifier
            deviceString = "sessioncipher"
            // SessionCiphers contain the storage, which contains the SessionCipher...
            // To solve this, we remove it before saving
            record.storage = undefined
        }
        if (await this.store.hasSession(identityId)) {
            await this.store.updateSessionKeys(identityId, deviceString, record)
        } else {
            await this.store.addSession(identityId, deviceString, record)
        }
    }
}

SignalProtocolStore.Direction = {
    SENDING: 1,
    RECEIVING: 2,
}

module.exports = SignalProtocolStore;