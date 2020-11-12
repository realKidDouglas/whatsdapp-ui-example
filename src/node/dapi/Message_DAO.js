

class Message_DAO {
    constructor() {
    }

    async create_message(connection, receiverid, content) {
        try {
            const doc_properties = {
                receiverid: receiverid,
                content: content
            }
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
        } catch (e) {
            console.error('Something went wrong:', e);
        }
    }

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



    async delete_message(connection, messageid) {
        try {// Retrieve the existing document
            const [document] = await connection.platform.documents.get(
                'message_contract.message',
                {where: [['$id', '==', messageid]]}
            );

            // Sign and submit the document delete transition
            return connection.platform.documents.broadcast({delete: [document]}, connection.identity);
        } catch (e) {
            console.error('Something went wrong:', e);
        }
    }
}

module.exports.Message_DAO = Message_DAO;