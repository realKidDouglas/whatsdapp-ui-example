const Dash = require('dash');

class Connection {
    constructor(mnemonic = null) {
        this.clientOpts = {
            network: 'evonet',
            wallet: {mnemonic},
            apps: {
                message_contract: {
                    contractId: '9XyDEmA1Xpx2JGRAZb2zVnQ9bGAMe5dWqX3N2qFr17u8'
                },
                profile_contract: {
                    contractId: '3FzFuoqDftpdRNCvFC5RP84Xc87M1r8Y9QD8jXZv9t5b'
                }
            }
        };
        this.client = new Dash.Client(this.clientOpts);
    }
}

module.exports.Connection = Connection;