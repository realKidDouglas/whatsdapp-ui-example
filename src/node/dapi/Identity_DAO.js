/**
 * @author: Panzerknacker, Mr. P
 */
class Identity_DAO {
    constructor() {
    }

    /**
     * Create a new identity
     * @param connection :{
     *     identity: resolved identity by id -- Can be undefined
     *     platform: Dash Platform object
     * }
     * @returns the resolved identity
     */
    async create_identity(connection) {
        try {
            const identiy = await connection.platform.identities.register();

            return identiy;
        } catch (e) {
            console.error('Something went wrong:', e);
        }
    }

    /**
     * Top up the given identity in the connection with extra credits
     * @param connection: {
     *     identity: resolved identity by id
     *     platform: Dash Platform object
     * }
     * @param top_up_amount in credits
     * @returns check if everything is fine
     */
    async top_up_identity(connection, top_up_amount) {
        try {
            await connection.platform.identities.topUp(connection.identity.getId().toJSON(), top_up_amount);
        } catch (e) {
            console.error('Something went wrong:', e);
        }
    }

    /**
     * Register a name at dash platform
     * @param connection: {
     *     identity: resolved identity by id
     *     platform: Dash Platform object
     * }
     * @param name: The name for the dpns-name registration (name+.dash)
     * @returns check if everything is fine
     */
    async create_dpns_name(connection, name) {
        try {
            const register = await connection.platform.names.register(
                name,
                {dashUniqueIdentityId: connection.identity.getId()},
                connection.identity,
            );

            return register;

        } catch (e) {
            console.error('Something went wrong:', e);
        }
    }

    /**
     * Resolve a dpns-name to an identity
     * @param connection: {
     *     identity: resolved identity by id
     *     platform: Dash Platform object
     * }
     * @param name: The dpns name (name+.dash)
     * @returns The identity which belongs to the name
     */
    async find_identity_by_name(connection, name) {
        try {
            return connection.platform.names.resolve(name);
        } catch (e) {
            console.log('Something went wrong:', e);
        }
    }

    /**
     * Return the identity balance
     * @param connection
     * @returns Credits
     */
    async getIdentityBalance(connection){
        try{
            return connection.identity.balance;
        }catch (e) {
            console.log('Something went wrong:', e);
        }
    }
}

module.exports.Identity_DAO = Identity_DAO;