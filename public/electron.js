const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const electron = require('./src/background');
const url = require('url');

let mainWin;
function createWindow() {
    mainWin = new BrowserWindow({
        show: false,
        frame: process.platform === 'darwin',
        width: 1300,
        height: 700,
        center: true,
        transparent: process.platform !== 'darwin',
        icon: path.resolve(__dirname, '..', 'src', 'assets', 'logo', 'logo-96.png'),
        webPreferences: {
            nodeIntegration: true,
        },
    });
    const startURL = isDev
        ? 'http://localhost:3000'
        : url.format({
              pathname: path.join(__dirname, '/../build/index.html'),
              protocol: 'file:',
              slashes: true,
          });

    mainWin.loadURL(startURL);
    mainWin.webContents.on('did-finish-load', () => {
        const { title } = require('../package.json');
        mainWin.setTitle(`${title}`);
    });
    mainWin.once('ready-to-show', () => mainWin.show());
    mainWin.on('closed', () => {
        mainWin = null;
    });
    electron.setMainWin(mainWin);
    if (isDev) {
        mainWin.webContents.openDevTools();
    }
}

app.on('ready', createWindow);
