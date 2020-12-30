const {
    getKey,
    getSalt,
    getStorageKeyHash,
    aesEncryptUint8Array,
    aesDecryptUint8Array
} = require('./local_storage_crypt');
const fs = require('fs-extra');
const path = require('path');

/**
 * Example implementation of a WhatsDapp storage provider for node/electron
 *
 * stores information in a directory that's configured with the constructor
 * options.
 *
 * @param opts {{storagePath: string, password: string | Uint8Array}}
 * @constructor
 */
class LocalStorage {

    constructor(opts) {
        if (!opts.storagePath) throw new Error('storage opts need a string path to a directory')
        if (!opts.password) throw new Error('storage opts need a password to encrypt the storage')
        const {storagePath, password} = opts

        // set up lifetime constants
        this._storagePath = storagePath
        this._salt = getSalt(storagePath)
        this._key = getKey(password, this._salt)
        console.log(password)
    }

    /**
     *
     * @param key {string}
     * @return {Promise<Uint8Array | null>}
     */
    async get(key) {
        let ret = null;
        try {
            const hashedKey = getStorageKeyHash(key, this._salt);
            const pathToRead = path.join(this._storagePath, hashedKey);
            const encValue = await fs.readFile(pathToRead)
            // Buffers are also instances of Uint8Array
            ret = aesDecryptUint8Array(encValue, this._key);
        } catch (e) {
            console.log("could not find value for key", e);
        }
        return ret;
    }

    /***
     *
     * @param key {string}
     * @param value {Uint8Array}
     */
    set(key, value) {
        const hashedKey = getStorageKeyHash(key, this._salt);
        if (value == null) {
            this._delete(hashedKey);
            return;
        }
        const encValue = aesEncryptUint8Array(value, this._key);
        const pathToWrite = path.join(this._storagePath, hashedKey);
        fs.writeFileSync(pathToWrite, encValue);
    }

    /**
     *
     * @param hashedKey {string}
     * @private
     */
    _delete(hashedKey) {
        const pathToDelete = path.join(this._storagePath, hashedKey);
        fs.removeSync(pathToDelete);
    }
}

module.exports = LocalStorage
