/**
 * @author: Panzerknacker, Mr. P
 */
class Message_DAO {
    constructor() {
    }

    /**
     * Create a message in form of the message contract and broadcast it to the platform
     * @param connection :{
     *     identity: resolved identity by id
     *     platform: Dash Platform object
     * }
     * @param receiverid: ID in Base58Check of the receiver
     * @param content: The content of the message
     * @returns The check, that the message is published
     */
    async create_message(connection, receiverid, content) {
        const doc_properties = {receiverid, content}
        // Create the message document
        const message_document = await connection.platform.documents.create(
            'message_contract.message',
            connection.identity,
            doc_properties,
        );

        const document_batch = {
            create: [message_document],
        }

        return connection.platform.documents.broadcast(document_batch, connection.identity);
    }

    /**
     * Here we receive a message from a specified user. We check the ownerId of the document with the senderId. E.g. Alice
     * wants to check, if Bob writes her a message. SenderId = Bobs ID in HEX.
     * @param connection :{
     *     identity: resolved identity by id
     *     platform: Dash Platform object
     * }
     * @param senderid: ID of the owner encoded in HEX and the identifier flag
     * @returns all messages of a specified user
     */
    async get_messages_from(connection, senderid) {
        console.log(senderid)
        try {
            const documents = await connection.platform.documents.get(
                'message_contract.message',
                {
                    where: [
                        ['$ownerId', "==", senderid],
                        ['receiverid', "==", connection.identity.getId().toJSON()]

                    ],
                },
            );

            return documents

        } catch (e) {
            console.error('Something went wrong:', e);
        }
    }

    /**
     * Receive all messages of the user
     * @param connection :{
     *     identity: resolved identity by id
     *     platform: Dash Platform object
     * }
     * @returns all messages of the user
     */
    async get_messages(connection) {
        try {
            const documents = await connection.platform.documents.get(
                'message_contract.message',
                {
                    where: [
                        ['receiverid', "==", connection.identity.getId().toJSON()]
                    ],
                },
            );

            return documents

        } catch (e) {
            console.error('Something went wrong:', e);
        }
    }

    /**
     * Receive all messages after a specific time. To parse a timestring (Json-Timestring) into a integer (milliseconds)
     * use the following function:
     * <document>.createdAt.getTime()
     * @param connection :{
     *     identity: resolved identity by id
     *     platform: Dash Platform object
     * }
     * @param time - Integer: Time in milliseconds
     * @returns {Promise<*>}
     */
    async get_messages_by_time(connection, time) {
        try {
            const documents = await connection.platform.documents.get(
                'message_contract.message',
                {
                    where: [
                        ['receiverid', "==", connection.identity.getId().toJSON()],
                        ['$createdAt', ">=", time]
                    ],
                },
            );

            return documents

        } catch (e) {
            console.error('Something went wrong:', e);
        }
    }

    /**
     * Delete a message
     * @param connection :{
     *     identity: resolved identity by id
     *     platform: Dash Platform object
     * }
     * @param messageid
     * @returns {Promise<*>}
     */
    async delete_message(connection, messageid) {
        try {// Retrieve the existing document
            const [document] = await connection.platform.documents.get(
                'message_contract.message',
                {where: [['$id', '==', messageid]]}
            );

            // Sign and submit the document delete transition
            return connection.platform.documents.broadcast({delete: [document]}, connection.identity);
        } catch (e) {
            console.log('Something went wrong:', e);
        }
    }

    /**
     *
     * @param connection
     * @param time
     * @param senderid
     * @returns {Promise<*>}
     */
    async getMessageFromByTime(connection, time, senderid){
        try{
            const documents = await connection.platform.documents.get(
                'message_contract.message',
                {
                    where: [
                        ['$ownerId', "==", senderid],
                        ['receiverid', "==", connection.identity.getId().toJSON()],
                        ['$createdAt', ">=", time],
                    ],
                },
            );

            return documents
        }catch (e) {
            console.log('Something went wrong:', e);
        }
    }
}

module.exports.Message_DAO = Message_DAO;