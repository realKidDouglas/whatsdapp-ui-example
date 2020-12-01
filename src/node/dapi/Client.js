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
            wallet: {mnemonic},
            apps: {
                message_contract: {
                    contractId: '5RNvuFQjFQXZLUDJ4dJdagULLeqsKbHTvh6dUR3LQqbC'
                },
                profile_contract: {
                    contractId: 'EZasUKrqisqKx9UrorWs37LU8pxcgnTv7Nbf4o4geNDL'
                }
            }
        };
        this.client = new Dash.Client(this.clientOpts);
    }
}

module.exports.Client = Client;