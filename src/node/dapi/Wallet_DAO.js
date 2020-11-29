class Wallet_DAO {
	constructor() {

	}

	async create_wallet(client) {
		try {
			return client.wallet.exportWallet();
		} catch (e) {
			console.log('Something went wrong:', e);
		}
	}

	async getUnusedAddress(client) {
		try {
			const account = await client.getWalletAccount();
			const address = account.getUnusedAddress();

			return address;
		} catch (e) {
			console.log('Something went wrong:', e);
		}
	}

}

module.exports.Wallet_DAO = Wallet_DAO;