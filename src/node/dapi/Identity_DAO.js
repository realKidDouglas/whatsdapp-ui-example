class Identity_DAO {
    constructor() {
    }

    async create_identity(connection) {
        try {
            const identiy = await connection.platform.identities.register();

            return identiy;
        } catch (e) {
            console.error('Something went wrong:', e);
        }
    }

    async top_up_identity(connection, top_up_amount) {
        try {
            await connection.platform.identities.topUp(connection.identity.getId().toJSON(), top_up_amount);
        } catch (e) {
            console.error('Something went wrong:', e);
        }
    }

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

    async find_identity_by_name(connection, name) {
        try {
            return connection.platform.names.resolve(name);
        } catch (e) {
            console.error('Something went wrong:', e);
        }
    }


}

module.exports.Identity_DAO = Identity_DAO;