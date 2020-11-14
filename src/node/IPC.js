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

    ipcMain.handle('loginUser', (event, user) => {
        return messenger.loginUser(user);
    });

    ipcMain.handle('logoutCurrentUser', (event) => {
        return messenger.logoutUser(user);
    });
}
