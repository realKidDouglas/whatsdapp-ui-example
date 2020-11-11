/**
 * for some reason a hist file got 8 times as big as allowed, so we better
 * rewrite the history and make new chunks to keep performance up.
 * @param identityId {string}
 * @return {Promise<void>}
 * @private
 */
module.exports = async function _reorganizeHistory(identityId) {
    console.log("reorganizing history!")
    return Promise.resolve()
}