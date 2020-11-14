const error = require('./node/error');
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const localshortcut = require('electron-localshortcut');
const path = require('path');
const url = require('url');

const ipcStart = require('./node/IPC');
const storagePath = path.join(app.getPath('userData'), 'whatsDappSessions')


const enableDevTools = true;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
/**
 * @type {Electron.BrowserWindow}
 */
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

    mainWindow.once('ready-to-show', setUpIPC)
}

function setUpIPC() {
    ipcStart({storagePath, window: mainWindow});
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

