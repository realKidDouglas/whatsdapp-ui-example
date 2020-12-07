const WhatsDappNodeStorage = require("./storage/storage");
const {WhatsDapp, SignalWrapper} = require('whatsdapp');
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
    let signal;

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
        signal = new SignalWrapper()
        messenger = new WhatsDapp();
        if (!await storage.hasPrivateSignalKeys()) {
            const keys = await signal.generateSignalKeys()
            await storage.setPrivateData(keys.private)
            options.preKeyBundle = keys.preKeyBundle
        }
        const sessionIds = await storage.getSessions()
        const contacts = sessionIds.map(si => ({handle: si}))

        messenger.on('new-session', async (session, preKeyBundle) => {
            console.log("new session", session)

            await signal.buildAndPersistSession(storage, session.profile_name, preKeyBundle)
            sendMessageToWebContents(window, 'new-session', [session])
        })

        messenger.on('new-message', async (msg, session, sentByUs) => {
            if (!sentByUs) {
                msg.content = await signal.decryptMessage(storage, msg.ownerId, msg.content)
            }
            storage.addMessageToSession(session.profile_name, msg)
                .catch(e => console.log('add message fail:', e));
            sendMessageToWebContents(window, 'new-message', [msg, session]);
        })

        const lastTimestamp = await storage.getLastTimestamp();
        return messenger.connect(Object.assign({}, options, {sessions: contacts, lastTimestamp}));
    }

    //login handling

    ipcMain.handle('get-sessions', async () => {
        const s = await messenger.getSessions()
        console.log("get-sessions", s)
        return s
    });

    ipcMain.handle('connect', handleConnect);

    ipcMain.handle('disconnect', () => messenger.disconnect());

    //message handling
    ipcMain.handle('sendMessage', async (event, receiver, plaintext) => {
        const ciphertext = await signal.encryptMessage(storage, receiver, plaintext)
        return messenger.sendMessage(receiver, ciphertext);
    });

    ipcMain.handle('get-chat-history', async (event, contact) => {
        // TODO: make more args available, getPreviousMessages
        // TODO: can be used to get any part of the history.
        const msg = await Promise.all(storage.getPreviousMessages(contact.profile_name));
        return msg.filter(m => m != null);
    });

    ipcMain.handle('findcontact', async (event, dpnsname) => {
        const n = await messenger.getProfileByName(dpnsname)
        const f = n.displayName
        

        return n;
        
      });
}
