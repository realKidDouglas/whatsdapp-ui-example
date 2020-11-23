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
    this.getLocalRegistrationId = function() {
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

        const address = new libsignal.ProtocolAddress.from(identifier);
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

    /* Returns a prekeypair object or undefined */
    this.loadPreKey = function(keyId) {
        var res = this.get('25519KeypreKey' + keyId);
        if (res !== undefined) {
            res = { pubKey: res.pubKey, privKey: res.privKey };
        }
        return Promise.resolve(res);
    }
    this.storePreKey = function(keyId, keyPair) {
        return Promise.resolve(this.store.setOwnData('preKey_' + keyId, keyPair)['preKey_' + keyId]);
    }
    this.removePreKey = function(keyId) {
        return Promise.resolve(this.remove('25519KeypreKey' + keyId));
    }

    /* Returns a signed keypair object or undefined */
    this.loadSignedPreKey = function(keyId) {
        var res = this.get('25519KeysignedKey' + keyId);
        if (res !== undefined) {
            res = { pubKey: res.pubKey, privKey: res.privKey };
        }
        return Promise.resolve(res);
    }
    this.storeSignedPreKey = function(keyId, keyPair) {
        return Promise.resolve(this.store.setPrivateData('signedPreKey_' + keyId, keyPair)['signedPreKey_' + keyId]);
    }
    this.removeSignedPreKey = function(keyId) {
        return Promise.resolve(this.remove('25519KeysignedKey' + keyId));
    }

    this.loadSession = function(identifier) {
        const deviceId = this._getDeviceId(identifier);
        let key;
        if (deviceId !== -1) {
            key = "session-device-" + deviceId;
            identifier = identifier.replace("." + deviceId, "");
        } else {
            key = "session";
        }
        return Promise.resolve(this.store.getSessionKeys(identifier)[key]);
    }
    this.storeSession = function(identifier, record) {
        var deviceId = this._getDeviceId(identifier);
        var address = new libsignal.ProtocolAddress.from(identifier);
        let name = identifier;
        if (deviceId !== -1) {
            const key = "session-device-" + deviceId;
            name = identifier.replace("." + deviceId, "");
        } else {
            const key = "session";
        }
        return Promise.resolve(
            this.store.updateSessionKeys(identifier, record).catch(
                () => this.store.addSession(identifier, record)
            )
        );
    }
}

SignalProtocolStore.Direction = {
    SENDING: 1,
    RECEIVING: 2,
}

module.exports = SignalProtocolStore;