const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

function getLastData() {
    const result = ipcRenderer.sendSync('@storage', { action: 'GET' });
    return result;
}

function setLastData(data) {
    const newData = getLastData().filter((item) => item.package !== data.package);
    newData.push(data)
    ipcRenderer.sendSync('@storage', { action: 'SAVE', obj: newData });
}

function deleteData(packageApp) {
    let lastData = ipcRenderer.sendSync('@storage', { action: 'GET' });
    const newData = lastData.filter((item) => item.package !== packageApp);
    ipcRenderer.sendSync('@storage', { action: 'SAVE', obj: newData });
}

export default {
    setLastData,
    getLastData,
    deleteData
}