const { ipcMain } = require('electron');
const WhatsdappController = require('./WhatsdappController')
const controller = new WhatsdappController.WhatsdappController();


//message handling

ipcMain.handle('sendMessage', (event, receiver, message) => {
    return controller.sendMessage(receiver, message);
});

ipcMain.handle('getNewMessagesFrom', (event, contact) => {
    return controller.getNewMessagesFrom(contact);
});

ipcMain.handle('newMessagesAvailable', (event) => {
    return controller.getContactsWithNewMessages();
});

ipcMain.handle('getChatHistoryOf', (event, contact) => {
    return controller.getChatHistoryOf(contact);
});


//login handling

ipcMain.handle('getContacts', (event) => {
    return controller.getContacts();
});

ipcMain.handle('loginUser', (event, user) => {
    return controller.loginUser(user);
});

ipcMain.handle('logoutCurrentUser', (event) => {
    return controller.logoutUser(user);
});