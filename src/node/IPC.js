const {ipcMain} = require('electron');

/**
 *
 * @param messenger {WhatsDapp}
 */
module.exports = function (messenger) {
    //message handling
    ipcMain.handle('sendMessage', (event, receiver, message) => {
        return messenger.sendMessage(receiver, message);
    });

    ipcMain.handle('getNewMessagesFrom', (event, contact) => {
        return messenger.getNewMessagesFrom(contact);
    });

    ipcMain.handle('newMessagesAvailable', (event) => {
        return messenger.getContactsWithNewMessages();
    });

    ipcMain.handle('getChatHistoryOf', (event, contact) => {
        return messenger.getChatHistoryOf(contact);
    });


//login handling

    ipcMain.handle('getContacts', (event) => {
        return messenger.getContacts();
    });

    ipcMain.handle('loginUser', (event, input) => {
        let options = {
            mnemonic: "permit crime brush cross space axis near uncle crush embark hill apology",
            identity: "9hnTvxpxJKPefK7HKmnyBBYMYr3B9jDw94UwDJb1F7X2",
            displayname: "robsenwhats"
        }


        return messenger.loginUser(options);
    });

    ipcMain.handle('logoutCurrentUser', (event) => {
        return messenger.logoutUser(user);
    });
}
