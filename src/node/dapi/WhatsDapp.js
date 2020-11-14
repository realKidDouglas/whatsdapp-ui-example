const clientConnection = require('./Client');
const dapiFacade = require('./DAPI_Facade');
const EventEmitter = require('events');

class WhatsDapp extends EventEmitter {

    constructor() {
        super();
        this.dapi = new dapiFacade.DAPI_Facade();
        this.activeUser = undefined;
        this.messagesCache = [];
        this.contacts = [];
        this.client = undefined;
        this.connection = {
            identity: undefined,
            platform: undefined
        }
    }

    async loginUser(options) {
        try {
            console.log(options);
            this.client = new clientConnection.Client(options.mnemonic).client;
            this.connection.platform = this.client.platform;

            if(options.identity === undefined){
                let id = await this.dapi.create_identity(this.connection);
                options.identity = id.getId().toJSON()
                console.log(options.identity);
            }


            this.connection.identity = await this.connection.platform.identities.get(options.identity);

            let profile = await this.dapi.get_profile(this.connection, options.identity);
            console.log(profile);

            if(profile === undefined){
                console.log("create new one");
                let content = {
                    identity_public_key: "Kommt später",
                    signed_identity_public_key: "Kommt später",
                    prekeys: ["kommt", "später"],
                    displayname: options.displayname,
                }
                await this.dapi.create_profile(this.connection, content);
                profile = await this.dapi.get_profile(this.connection, options.identity);
            }

            this.loadChats();
            this.sendMessage("", "", "");

            return {
                handle: profile.data.displayname
            };
        }
        catch(e) {
            console.error('Something went wrong:', e);
            return undefined;
        }
    }

    loadChats() {

        //testing. Object formats are just rough drafts, can be improved
        this.messagesCache["robsenwhats"] = {
            messages: [
                {
                    senderHandle: "philipwhats",
                    timestamp: "13.11.2020 17:00",
                    content: "Dies ist eine alte Nachricht von robin"
                },
                {
                    senderHandle: "robsenwhats",
                    timestamp: "13.11.2020 17:01",
                    content: "Dies ist noch eine alte Nachricht von robin"
                },
                {
                    senderHandle: "testUser",
                    timestamp: "13.11.2020 17:05",
                    content: "Dies ist eine alte Nachricht von dir selber"
                }
            ],
            newMessages: 0
        };
        this.messagesCache["pippowhats"] = {
            messages: [
                {
                    senderHandle: "pippowhats",
                    timestamp: "13.11.2020 17:00",
                    content: "Dies ist eine alte Nachricht von philip"
                }
            ],
            newMessages: 0
        };
        this.contacts = [{ handle: "robsenwhats" }, { handle: "pippowhats"}, {handle: "testContactWithNoMessages"}];
    }

    sendMessage(receiver, message, keybundle) {
        // Hier kommt der Signalkram rein



        // Raus kommt verschlüsseltes messageobject.

        if(this.activeUser) {
            return this.dapi.create_message(this.connection, receiver, message);
        }
        else {
            return false; //no sending user defined
        }
    }

    async getContactsWithNewMessages(time) {
        let messages = await this.dapi.get_messages_by_time(this.connection, time);

        //TODO: Hier muss die Logik rein, die den Sessions aus dem Store abgleicht.
        /*
        this.fetchNewMessages();

        let returnContacts = [];
        this.contacts.forEach( contact => {
            if(this.messagesCache[contact.handle])
                if (this.messagesCache[contact.handle].newMessages > 0)
                    returnContacts.push(contact);
        });
        return returnContacts;

         */
    }

    async getNewMessagesFrom(senderId) {
        return await this.dapi.get_messages_from(this.connection, senderId);
    }

    async fetchNewMessages(time) {
        return await this.dapi.get_messages_by_time(this.connection, time);
    }

    getContacts() {
        return this.contacts;
    }

    getChatHistoryOf(contact) {
        let chatHistory = [];
        if (this.messagesCache[contact.handle]) chatHistory = this.messagesCache[contact.handle].messages;
        return chatHistory;
    }

    logoutCurrentUser() {
        //TODO
    }
}

module.exports = WhatsDapp;