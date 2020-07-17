const { app, BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");
const electron = require('./src/background');

let mainWin;
function createWindow() {
    mainWin = new BrowserWindow({
        show: false,
        frame: false,
        width: 1300,
        height: 700,
        center: true,
        transparent: true,
        icon: path.resolve(__dirname, '..', 'src', 'assets', 'logo', 'logo-96.png'),
        webPreferences: {
            nodeIntegration: true,
        },
    });
    const startURL = isDev
        ? process.env.START_URL
        : `file://${path.join(__dirname, "../build/index.html")}`;

    mainWin.loadURL(startURL);
    mainWin.webContents.on("did-finish-load", () => {
        const { title } = require("../package.json");
        mainWin.setTitle(`${title}`);
    });
    mainWin.once("ready-to-show", () => mainWin.show());
    mainWin.on("closed", () => {
        mainWin = null;
    });
    electron.setMainWin(mainWin)
    if (isDev) {
        mainWin.webContents.openDevTools();
    }
}

app.on("ready", createWindow);