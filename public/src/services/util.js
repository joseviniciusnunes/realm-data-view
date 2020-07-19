const fs = require('fs');

function getUserFolder() {
    return process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME'];
}

function getFolderStorage() {
    const folder = `${getUserFolder()}/.realm-data-view`;
    createFolderStorage(folder);
    return folder;
}

function getFileRealmStorage() {
    return `${getFolderStorage()}\\db.realm`;
}

function createFolderStorage(folder) {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }
}

function getPathPlatformTools() {
    switch (process.platform) {
        case 'win32':
            return `${process.env['USERPROFILE']}/AppData/Local/Android/sdk/platform-tools`;
        case 'darwin':
            return `${process.env['HOME']}/Library/Android/sdk/platform-tools`;
        case 'linux':
            return `${process.env['HOME']}/Android/sdk/platform-tools`;
        default:
            return `${process.env['HOME']}/Android/sdk/platform-tools`;
    }
}

function createFileConfigAdb() {
    const pathFileConfig = `${getFolderStorage()}/config.json`;
    if (!fs.existsSync(pathFileConfig)) {
        const config = {
            path: getPathPlatformTools(),
        };
        fs.writeFileSync(pathFileConfig, JSON.stringify(config));
    }
}

function getConfig() {
    const pathFileConfig = `${getFolderStorage()}/config.json`;
    return JSON.parse(fs.readFileSync(pathFileConfig).toString());
}

async function clearFileTemp() {
    try {
        fs.rmdirSync(`${getFolderStorage()}/db.realm.management`);
    } catch (error) {}
    try {
        fs.unlinkSync(`${getFolderStorage()}/db.realm`);
    } catch (error) {}
    try {
        fs.unlinkSync(`${getFolderStorage()}/db.realm.lock`);
    } catch (error) {}
}

module.exports.getFolderStorage = getFolderStorage;
module.exports.getFileRealmStorage = getFileRealmStorage;
module.exports.clearFileTemp = clearFileTemp;
module.exports.createFileConfigAdb = createFileConfigAdb;
module.exports.getConfig = getConfig;
