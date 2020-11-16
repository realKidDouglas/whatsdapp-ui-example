function createdAtToTimestamp(createdAt) {
    return Number(createdAt)
}

function rawMessageToMessage(rawMessage) {
    const ownerId = rawMessage.ownerId.toString();
    const timestamp = createdAtToTimestamp(rawMessage.createdAt);

    // TODO: put content through the signal lib
    const content = rawMessage.data.content;
    const id = rawMessage.id.toString()

    return {
        // TODO: get senderHandle from (some) public profile!
        senderHandle: ownerId,
        timestamp,
        content,
        id,
        ownerId
    }
}

function transitionToMessage(transition, ownerId) {
    return rawMessageToMessage(Object.assign({}, transition, {ownerId: ownerId.id.toJSON()}))
}

module.exports = {
    rawMessageToMessage,
    transitionToMessage
}