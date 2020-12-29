module.exports = {
    // the file where the salt for this storage will be stored
    SALT_FILE_NAME: 'salt',
    // salt byte length for scrypt
    SALT_LENGTH: 32,
    // the used block cipher
    ALGO: 'aes-256-gcm',
    // iv byte length for aes-gcm
    IV_LENGTH: 16,
    // byte length of the auth tag for aes-gcm
    TAG_LENGTH: 16,
}
