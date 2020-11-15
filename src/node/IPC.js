const WhatsDappNodeStorage = require("./storage/storage");
const WhatsDapp = require("./dapi/WhatsDapp");
const {ipcMain} = require('electron');

/**
 * tie the main components of the app together.
 * currently assumes that there's exactly one window.
 * @param opts {{window: Electron.BrowserWindow, storagePath: string}}
 */
module.exports = function (opts) {
    const {window, storagePath} = opts;
    let storage;
    let messenger;

    function sendMessageToWebContents(window, message, args) {
        if (!window || window.isDestroyed()) {
            console.log(`BrowserWindow unavailable, not sending message ${message}:\n${args}`)
            return
        }
        if (!window.webContents || window.webContents.isDestroyed()) {
            console.log(`WebContents unavailable, not sending message ${message}:\n${args}`)
            return
        }
        window.webContents.send(message.toString(), args)
    }

    async function handleConnect(evt, options) {
        const {mnemonic} = options
        storage = new WhatsDappNodeStorage({
            password: mnemonic,
            storagePath
        })
        messenger = new WhatsDapp();
        const sessionIds = await storage.getSessions()
        const contacts = sessionIds.map(si => ({handle: si}))

        messenger.on('new-session', session => {
            console.log("new session", session)
            storage.addSession(session.handle, {keys: "somekeys!"})
            sendMessageToWebContents(window, 'new-session', [session])
        })

        messenger.on('new-message', (msg, session) => {
            console.log('new message', msg, session);
            storage.addMessageToSession(session.handle, msg)
                .catch(e => console.log('add message fail:', e));
            sendMessageToWebContents(window, 'new-message', [msg, session]);
        })

        return messenger.connect(Object.assign({}, options, {sessions: contacts}));
    }

    //login handling

    ipcMain.handle('get-sessions', async (event) => {
        const s = await messenger.getSessions()
        console.log("get-sessions", s)
        return s
    });

    ipcMain.handle('connect', handleConnect);

    ipcMain.handle('disconnect', () => messenger.disconnect());

    //message handling
    ipcMain.handle('sendMessage', (event, receiver, message) => {
        return messenger.sendMessage(receiver, message);
    });

    ipcMain.handle('newMessagesAvailable', (event) => {
        return messenger.getContactsWithNewMessages();
    });

    ipcMain.handle('getChatHistoryOf', async (event, contact) => {
        // TODO: make more args available, getPreviousMessages
        // TODO: can be used to get any part of the history.
        const msg = await Promise.all(storage.getPreviousMessages(contact.handle));
        return msg.filter(m => m != null);
    });
}