module.exports = {
    // the file where each session's metatdata will be stored
    MAP_FILE_NAME: 'map.blk',
    // the file where the salt for this storage will be stored
    SALT_FILE_NAME: 'salt',
    // the file where the own signal keys will be stored
    PRIVATE_FILE_NAME: 'priv',
    // the file where the user data will be stored
    USER_FILE_NAME: 'usr',
    // salt byte length for scrypt
    SALT_LENGTH: 32,
    // the used block cipher
    ALGO: 'aes-256-gcm',
    // iv byte length for aes-gcm
    IV_LENGTH: 16,
    // byte length of the auth tag for aes-gcm
    TAG_LENGTH: 16,
    // how many bytes will be stored in a chunk before the next one will be started
    CHUNK_SIZE_SOFT_MAX: 1024 * 8,
    // how big a chunk may get (due to out-of-order messages) before the history will be rewritten
    CHUNK_SIZE_MAX: 1024 * 64,
    // default number of messages returned by query
    DEFAULT_MSG_COUNT: 20,
    // how fuzzy the chunk size is (ie 5 bytes will be considered empty)
    CHUNK_SIZE_BUF: 5,
}
