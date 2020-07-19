const fs = require('fs');

function getFolderStorage() {
    const folder = `${process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME']}/.realm-data-view`;
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
