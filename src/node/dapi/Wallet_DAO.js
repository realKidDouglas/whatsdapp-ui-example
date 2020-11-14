

class Wallet_DAO {
    constructor() {

    }

    async create_wallet(client){
        try {

                const account = await client.getWalletAccount();

                return client.wallet.exportWallet();


        } catch (e) {
            console.error('Something went wrong:', e);
        }
    }

}

module.exports.Wallet_DAO = Wallet_DAO;