const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const localshortcut = require('electron-localshortcut');
const path = require('path');
const url = require('url');
require('./node/guiHandler')


//
// ## Storage Example Code
//
const identityId = "someIdentityId"
let whatsDappStorage
try {
    const WhatsDappStorage = require('./node/storage/storage')
    whatsDappStorage = new WhatsDappStorage({
        password: 'password',
        storagePath: path.join(app.getPath('userData'), 'whatsDappSessions')
    })

    const addMessagePeriodic = () => {
        let resolve
        const ret = new Promise(res => resolve = res)

        let i = 0
        const interval = setInterval(() => {
            i++
            // add messages with pretty much random offsets
            const timestamp = Date.now() - Math.floor(Math.random() * 100000)
            const msg = {timestamp, message: ("hello there! ").repeat(2) + timestamp}
            whatsDappStorage.addMessageToSession(identityId, msg)

            if (i > 10) {
                console.log('stopping')
                clearInterval(interval)
                setTimeout(() => whatsDappStorage.printSession(identityId).then(resolve), 100)
            }
        }, 100)
        return ret
    }

    const p = whatsDappStorage.getSessions()
    p.then(sessions => {
        if (sessions.length === 0) return whatsDappStorage.addSession(identityId, {keys: ["keyA", "keyB"]})
        return Promise.resolve()
    })
        .then(addMessagePeriodic)
        .then(() => {
            // print 5 messages, starting from the newest one going back in time. this immediately
            // returns an array of promises (not a promise of an array!)
            // that will be resolved in order of the message time stamps.
            whatsDappStorage.getPreviousMessages(identityId, undefined, 5)
                .map(p => p.then(m => console.log(m)))
        })
} catch (e) {
    console.log("storage init err: ", e)
}

//
// ## end storage example code
//

const enableDevTools = true;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({width: 800, height: 600, webPreferences: {nodeIntegration: true}});

    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '/../build/index.html'),
        protocol: 'file:',
        slashes: true
    });
    mainWindow.loadURL(startUrl);

    mainWindow.setMenuBarVisibility(false);

    // Open the DevTools.
    if (enableDevTools) {
        localshortcut.register(mainWindow, "F12", () => mainWindow.webContents.openDevTools({
            mode: 'detach'
        }))
    }

    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    })
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

console.error("end of main")

