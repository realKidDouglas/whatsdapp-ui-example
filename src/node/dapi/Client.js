const Dash = require('dash');

/**
 * Client for the connection to Dashplatform
 * TODO: network & contractId's from envfile.
 * @author: Panzerknacker, Mr. P
 */
class Client {
    constructor(mnemonic = null) {
        this.clientOpts = {
            network: 'evonet',
            wallet: {
                mnemonic: mnemonic,
            },
            apps: {
                message_contract: {
                    contractId: '5RNvuFQjFQXZLUDJ4dJdagULLeqsKbHTvh6dUR3LQqbC'
                },
                profile_contract: {
                    contractId: '3FzFuoqDftpdRNCvFC5RP84Xc87M1r8Y9QD8jXZv9t5b'
                }
            }
        };
        this.client = new Dash.Client(this.clientOpts);
    }
}

module.exports.Client = Client;