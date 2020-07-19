const { ipcMain } = require('electron');
const Adb = require('./services/adb');
const Realm = require('./services/realm');
const fs = require('fs');
const isDev = require('electron-is-dev');
const Util = require('./services/util');

let mainWin;

ipcMain.on('@window-action', (event, action) => {
    switch (action) {
        case 'CLOSE':
            return mainWin.close();
        case 'FULLSCREEN':
            mainWin.maximize();
            return toFullScreen();
        case 'DROP':
            mainWin.unmaximize();
            return toDropWindow();
        case 'MINIMIZE':
            return mainWin.minimize();
        default:
            return;
    }
});

ipcMain.on('@get-data', async (event, param) => {
    try {
        switch (param.action) {
            case 'DEVICES':
                event.returnValue = await Adb.getDevices();
                return;
            case 'SCHEMAS':
                event.returnValue = await Realm.getAllObjAllSchema(param.data);
                return;
            case 'ADB_PATH':
                event.returnValue = await Adb.existsAdbPath();
                return;
            default:
                event.returnValue = [];
                return;
        }
    } catch (error) {
        event.returnValue = error;
    }
});

ipcMain.on('@storage', async (event, param) => {
    try {
        switch (param.action) {
            case 'GET':
                event.returnValue = getStorage();
                return;
            case 'SAVE':
                event.returnValue = saveStorage(param.obj);
                return;
            default:
                return;
        }
    } catch (error) {
        event.returnValue = error;
    }
});

function setMainWin(win) {
    mainWin = win;
    mainWin.on('maximize', toFullScreen);
    mainWin.on('unmaximize', toDropWindow);
}

function toFullScreen() {
    mainWin.webContents.send('@window-state', true);
}

function toDropWindow() {
    mainWin.webContents.send('@window-state', false);
}

function getStorage() {
    if (!fs.existsSync(Util.getFolderStorage())) {
        return [];
    }
    if (!fs.existsSync(getFileStorage())) {
        return [];
    }
    return JSON.parse(fs.readFileSync(getFileStorage()).toString());
}

function saveStorage(obj) {
    fs.writeFileSync(getFileStorage(), JSON.stringify(obj));
}

function getFileStorage() {
    const env = isDev ? 'develop-' : '';
    return `${Util.getFolderStorage()}/${env}storage.json`;
}

module.exports.setMainWin = setMainWin;
