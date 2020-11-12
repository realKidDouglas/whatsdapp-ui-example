//Session

module.exports = {

	/**
	 * Create Messages for Communication, the Content have to be encryped - it is visible for everyone.
	 * @param connection - Object with the session_identity and platform object
	 * @param ownerid - OwnerID of the session_identity
	 * TODO: watch ownerid - if its cost many bits we may dont use it and calculate it every time again.
	 * @param content - Encrypted by ratchet
	 * @returns {Promise<*>}
	 * @author: Robin & Philip
	 */
	create_message: async function (connection, ownerid, content) {
		const doc_properties = {
			ownerid: ownerid,
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
	},

	/**
	 * This message receives all messages of a session_idendity
	 * TODO: Maybe we have to create another funktion, that only receives the last 10/100 Messages or so, to reduce traffic.
	 * TODO: If we delete all messages consequently this isnt a usecase.
	 * @param connection - Object with the session_identity and platform object
	 * @param ownerid - Id of the session_identity used for the communication
	 * @returns Array of messages
	 * @author Robin & Philip
	 */
	get_messages: async function (connection) {
		try {
			const queryOpts = {
				where: [
					['ownerid', "==", ownerid]
				],
			};
			const documents = await connection.platform.documents.get(
				'message_contract.message',
				queryOpts
			);
			return documents
		} catch (e) {
			console.error('Something went wrong:', e);
		}
	},

	/**
	 * If no longer needed the message can be "deleted" by this function. Deletion in the dash platform sense.
	 * @param connection - Object with the session_identity and platform object
	 * @param message_documentid
	 * @author Robin & Philip
	 */
	delete_message: async function (connection, message_documentid) {
		// Retrieve the existing document
		const [document] = await connection.platform.documents.get(
			'message_contract.message',
			{where: [['$id', '==', message_documentid]]}
		);

		// Sign and submit the document delete transition
		return connection.platform.documents.broadcast({delete: [document]}, connection.identity);
	},

	/**
	 * This function create a profile for a given identity. The profile has the identity_public_key
	 * and the signed_identity_public_key as attributes.
	 * TODO: Soll eine Identity die Möglichkeit besitzen, mehrere Profile anzulegen?
	 * @param ownerid
	 * @param profil: {identity_public_key: "string", signed_identity_public_key: "string"}
	 * @returns {*}
	 * @author Robin & Philip
	 */
	create_profile: async function (connection, ownerid, profil) {
		const doc_properties = {
			ownerid: ownerid,
			identity_public_key: profil.ipk,
			signed_identity_public_key: profil.sipk
		}
		// Create the note document
		const message_document = await connection.platform.documents.create(
			'profile_contract.profile',
			connection.identity,
			doc_properties,
		);

		const document_batch = {
			create: [message_document],
		}

		return connection.platform.documents.broadcast(document_batch, connection.identity);
	},

	/**
	 * In a certain time a profile should change the signed_identity_public_key. With this function
	 * you are able to change the signed_identity_public_key
	 * @param connection - Object with the session_identity and platform object
	 * @param ownerid - The id of the owner_identity of the profile
	 * @param sipk - signed_identity_public_key
	 * @returns If all good, we receive the changed Object
	 * @author Robin & Philip
	 */
	update_profile: async function (connection, ownerid, sipk) {

		// Retrieve the existing document
		const [document] = await connection.platform.documents.get(
			'profile_contract.profile',
			{where: [['ownerid', '==', ownerid]]}
		);

		// Update document
		document.set('signed_identity_public_key', sipk);

		// Sign and submit the document replace transition
		return connection.platform.documents.broadcast({replace: [document]}, connection.identity);
	},

	/**
	 * The function returns the profil to a given identity_id (ownerid).
	 * @param connection - Object with the session_identity and platform object
	 * @param ownerid - Id of the owner of the profile
	 * @returns {Promise<*>}
	 */
	get_profile: async function (connection, ownerid) {
		// Retrieve the existing document
		const [document] = await connection.platform.documents.get(
			'profile_contract.profile',
			{where: [['ownerid', '==', ownerid]]}
		);


		// Sign and submit the document replace transition
		return document;
	},
	/**
	 * The user can delete his profile entry. On this way other users cant find his credentials.
	 * @param connection - Object with the session_identity and platform object
	 * @param session_documentid
	 * @author: Robin & Philip
	 */
	delete_profile: async function (connection, profile_documentid) {
		// Retrieve the existing document
		const [document] = await connection.platform.documents.get(
			'profile_contract.profile',
			{where: [['$id', '==', profile_documentid]]}
		);

		// Sign and submit the document delete transition
		return connection.platform.documents.broadcast({delete: [document]}, connection.identity);
	},

	delete_profile_identity: async function (connection, ownerid) {

	},
	/**
	 * Get the identityid by dpns for connection. Care the dpns_names have to end with .dash!
	 * TODO: Insert a fault correction with adding a .dash on the end of the dpns_name if it isnt done so far.
	 * @param connection - Object with the session_identity and platform object
	 * @param dpns_name - dash name to find identity on a dns like way
	 * @author: Robin & Philip
	 */
	get_identityid_by_name: async function (connection, dpns_name) {
			// Retrieve by full name (e.g., myname.dash)
			// NOTE: Use lowercase characters only
			return connection.platform.names.resolve(dpns_name);

	},
	/**
	 * Get the identityid by dpns for connection. Care the dpns_names have to end with .dash!
	 * TODO: Insert a fault correction with adding a .dash on the end of the dpns_name if it isnt done so far.
	 * @param connection - Object with the session_identity and platform object
	 * @param dpns_name - dash name to find identity on a dns like way
	 * @author: Robin & Philip
	 */
	get_ownerid_by_identity: function (identityid) {
	},

}






