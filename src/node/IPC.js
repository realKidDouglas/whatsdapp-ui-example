const LocalStorage = require("./storage/local_storage");
const {WhatsDapp, WhatsDappEvent} = require('whatsdapp');
const {ipcMain} = require('electron');

/**
 * tie the main components of the app together.
 * currently assumes that there's exactly one window.
 * @param opts {{window: Electron.BrowserWindow, storagePath: string}}
 */
module.exports = function (opts) {
    const {window, storagePath} = opts;
    let localStorage;
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
        const {password} = options
        localStorage = new LocalStorage({password, storagePath})
        messenger = new WhatsDapp();
        messenger.on(WhatsDappEvent.StorageRead, (key, ret) => localStorage.get(key).then(value => ret(value)))
        messenger.on(WhatsDappEvent.StorageWrite, (key, value) => localStorage.set(key, value))
        messenger.on(WhatsDappEvent.StorageDelete, key => localStorage.set(key, null))
        const storage = messenger.storage;

        // create new account or just login with saved credentials?
        if (!options.mnemonic) {
            if (await storage.hasUserData()) {
                let usr = await storage.getUserData();
                options.mnemonic = usr.mnemonic;
                options.identity = usr.identityAddr;
                options.createDpnsName = null;
                options.displayname = usr.displayName;
            } else {
                console.error("Can't Connect! No mnemonic provided and no saved user data");
                return null;
            }
        } //TODO: Else: Delete storage, create a new one?

        const hasPrivateData = await storage.hasPrivateData();
        if (!hasPrivateData) {
            const keys = await messenger.createKeys();
            options.preKeyBundle = keys.preKeyBundle
        }
        const sessionIds = await storage.getSessions()
        const contacts = sessionIds.map(si => ({profile_name: si}))

        messenger.on(WhatsDappEvent.NewSession, async (session, preKeyBundle) => {
            console.log("new session", session)

            sendMessageToWebContents(window, 'new-session', [session])
        })

        messenger.on(WhatsDappEvent.NewMessage, async (msg, session) => {
            messenger._deleteMessages(messenger._getDeleteTimeFromContent(msg.content), msg.senderHandle);
            sendMessageToWebContents(window, 'new-message', [msg, session]);
        })

        messenger.on(WhatsDappEvent.NewMessageSent, async (msg, session) => {
            sendMessageToWebContents(window, 'new-message', [msg, session]);
        })

        const lastTimestamp = await storage.getLastTimestamp();
        const connectResult = await messenger.connect(Object.assign({}, options, {sessions: contacts, lastTimestamp}));

        //Connection successful, now we can save the used/generated user data, if new
        //TODO: save always?
        const hasUserData = await storage.hasUserData();
        if (!hasUserData) {
            let newUsr = {
                mnemonic: options.mnemonic,
                displayName: options.displayname,
                identityAddr: connectResult.identity,
                dpnsName: connectResult.createDpnsName
            }
            await storage.setUserData(newUsr);
        }

        if (options.createDpnsName && !connectResult.createDpnsName) {
            //user wanted to register a DPNS name, but it didn't work
            //Stop polling because UI will try to reconnect later with new DPNS name
            messenger.disconnect(); //TODO: Doesn't work?
        }

        return connectResult;
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
        const inputText = messenger.createInputMessage(plaintext);
        console.log("INPUTTEXT");
        console.log(inputText);
        return messenger.sendMessage(receiver, inputText);
    });

    ipcMain.handle('get-chat-history', async (event, contact) => {
        // TODO: make more args available, getPreviousMessages
        // TODO: can be used to get any part of the history.
        const msg = await messenger.storage.getPreviousMessages(contact.profile_name);
        return msg.filter(m => m != null);
    });

    ipcMain.handle('findcontact', async (event, dpnsname) => {
        const session = await messenger.getProfileByName(dpnsname);
        return session; // TODO: shouldn't return a session
    });
}
