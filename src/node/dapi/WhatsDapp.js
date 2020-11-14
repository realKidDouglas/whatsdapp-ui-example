const connection = require('./Connection');
const dapiFacade = require('./DAPI_Facade');
const EventEmitter = require('events');

class WhatsDapp extends EventEmitter {

    constructor() {
        super();
        this.dapi = new dapiFacade.DAPI_Facade();
        this.activeUser = undefined;
        this.messagesCache = [];
        this.contacts = [];
    }

    loginUser(user) {
        try {
            //connection establishment etc
            //here just testing. Object formats are just rough drafts, can be improved
            this.activeUser = {
                handle: "testUser",
                identity: "xxx",
                mnemonic: "x"
                //whatever needs to be remembered about our current user
            };
            
            this.loadChats();
            
            return {
                handle: this.activeUser.handle
                //other parameters needed by UI?
            };
        }
        catch {
            //TODO: should UI get an error or is no return value enough to indicate a failed login?
            return undefined;
        }
    }

    loadChats() {
        //testing. Object formats are just rough drafts, can be improved
        this.messagesCache["robsenwhats"] = {
            messages: [
                {
                    senderHandle: "robsenwhats",
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

    sendMessage(receiver, message) {
        if(this.activeUser) {
            if(!this.messagesCache[receiver.handle]) { //initiate chat
                this.messagesCache[receiver.handle] = {
                    messages: [],
                    newMessages: 0
                };
            }

            this.messagesCache[receiver.handle].messages.push({
                sender: this.activeUser.handle,
                timestamp: new Date().toLocaleString(),
                content: message
            });
            return true; //successfully sent
        }
        else {
            return false; //no sending user defined
        }
    }

    getContactsWithNewMessages() {
        this.fetchNewMessages();

        let returnContacts = [];
        this.contacts.forEach( contact => {
            if(this.messagesCache[contact.handle])
                if (this.messagesCache[contact.handle].newMessages > 0)
                    returnContacts.push(contact);
        });
        return returnContacts;
    }

    getNewMessagesFrom(contact) {
        this.fetchNewMessages();
        
        let newMessages = [];
        if (this.messagesCache[contact.handle]) {
            if (this.messagesCache[contact.handle].newMessages > 0) {
                newMessages = this.messagesCache[contact.handle].messages.slice(
                    this.messagesCache[contact.handle].messages.length -
                    this.messagesCache[contact.handle].newMessages
                );
                this.messagesCache[contact.handle].newMessages = 0;
            }
        }
        
        return newMessages;
    }

    fetchNewMessages() {
        //just testing. Object formats are just rough drafts, can be improved
        let receivedMessages = [
            {
                senderHandle: "robsenwhats",
                timestamp: "13.11.2020 18:01",
                content: "Dies ist eine neue Nachricht von robin"
            },
            {
                senderHandle: "robsenwhats",
                timestamp: "13.11.2020 18:02",
                content: "Dies ist noch eine neue Nachricht von robin"
            },
            {
                senderHandle: "pippowhats",
                timestamp: "13.11.2020 18:02",
                content: "Dies ist eine neue Nachricht von philip"
            }
        ]
        
        receivedMessages.forEach(message => {
            if(this.messagesCache[message.senderHandle]){
                this.messagesCache[message.senderHandle].messages.push(message);
                this.messagesCache[message.senderHandle].newMessages += 1;
            } 
            else {
                this.messagesCache[message.senderHandle] = {
                    messages: message,
                    newMessages: 1
                };
                this.contacts.push({handle: message.senderHandle})
            }
        });
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