/**
 * get the newest message timestamp that's in storage
 * @returns {Promise<number>} unix timestamp of the last message
 */
module.exports = async function getLastTimestamp() {
    await this.initialized
    let max = 0
    for (const identityId in this._metadata) {
        console.log(identityId)
        // get the newest messsage that has a timestamp smaller than infinity
        const lastMessage = await this.getPreviousMessages(identityId, Infinity, 1)[0]
        if (lastMessage == null) continue;
        max = Math.max(max, lastMessage.timestamp);
    }
    return max
}
