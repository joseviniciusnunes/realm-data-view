const { ipcMain } = require("electron");
const Adb = require('./services/adb');
const Realm = require('./services/realm');

let mainWin;

ipcMain.on("@window-action", (event, action) => {
    switch (action) {
        case 'CLOSE':
            return mainWin.close();
        case 'FULLSCREEN':
            mainWin.maximize()
            return toFullScreen();
        case 'DROP':
            mainWin.unmaximize()
            return toDropWindow();
        case 'MINIMIZE':
            return mainWin.minimize();
        default:
            return;
    }
});

ipcMain.on("@get-data", async (event, param) => {
    switch (param.action) {
        case 'DEVICES':
            event.returnValue = await Adb.getDevices();
            return;
        case 'SCHEMAS':
            event.returnValue = await Realm.getAllObjAllSchema(param.data);
            return;
        default:
            event.returnValue = [];
            return;
    }
});

function setMainWin(win) {
    mainWin = win;
    mainWin.on("maximize", toFullScreen);
    mainWin.on("unmaximize", toDropWindow);
}

function toFullScreen() {
    mainWin.webContents.send('@window-state', true);
}

function toDropWindow() {
    mainWin.webContents.send('@window-state', false);
}

module.exports.setMainWin = setMainWin;