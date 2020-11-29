const Message_DAO = require('./Message_DAO');
const Profile_DAO = require('./Profile_DAO');
const Identity_DAO = require('./Identity_DAO');
const Wallet_DAO = require('./Wallet_DAO');

/**
 * Interface to the persitence dapi layer. Interact only with this class to use the dapi.
 * @author: Panzerknacker, Mr. P
 */
class DAPI_Facade {
    constructor() {
        this.wallet_DAO = new Wallet_DAO.Wallet_DAO();
        this.profile_DAO = new Profile_DAO.Profile_DAO();
        this.identity_DAO = new Identity_DAO.Identity_DAO();
        this.message_DAO = new Message_DAO.Message_DAO();
    }

    async create_wallet(){
        return this.wallet_DAO.create_wallet();
    }

    async create_identity(connection){
        return this.identity_DAO.create_identity(connection);
    }

    async top_up_identity(connection, top_up_amount){
        return this.identity_DAO.top_up_identity(connection, top_up_amount);
    }

    async create_dpns_name(connection, name) {
        return this.identity_DAO.create_dpns_name(connection, name);
    }


    async find_identity_by_name(connection, name){
        return this.identity_DAO.find_identity_by_name(connection, name);
    }

    async create_profile(connection, content){
        return this.profile_DAO.create_profile(connection, content);
    }

    async get_profile(connection, ownerid){
        return this.profile_DAO.get_profile(connection, ownerid);
    }

    async update_profile(connection, content){
        return this.profile_DAO.update_profile(connection, content);
    }

    async delete_profile(connection){
        return this.profile_DAO.delete_profile(connection);
    }

    async create_message(connection, receiverid, content){
        return this.message_DAO.create_message(connection, receiverid, content);
    }

    async get_messages_from(connection, receiverid){
        return this.message_DAO.get_messages_from(connection, receiverid);
    }

    async get_messages(connection){
        return this.message_DAO.get_messages(connection);
    }

    async get_messages_by_time(connection, time){
        return this.message_DAO.get_messages_by_time(connection, time);
    }

    async delete_message(connection, messageid){
        return this.message_DAO.delete_message(connection, messageid);
    }

    async getMessageFromByTime(connection, time, senderid){
        return this.message_DAO.getMessageFromByTime(connection, time, senderid);
    }

    async getIdentityBalance(connection){
        return this.identity_DAO.getIdentityBalance(connection);
    }

    async getUnusedAddress(client){
        return this.wallet_DAO.getUnusedAddress(client);
    }
}

module.exports.DAPI_Facade = DAPI_Facade;