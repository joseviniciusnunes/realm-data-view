const { execSync } = require('child_process');
const path = require('path');
const Util = require('./util');

async function copyFileDevice({ package, fileRealm, device }) {
    try {
        await Util.clearFileTemp();
        const cmdDesc = ` -s ${device} pull "/data/data/${package}/files/${fileRealm}" "${Util.getFileRealmStorage()}"`;
        await cmd(cmdDesc);
    } catch (error) {
        throw error;
    }
}

async function getDevices() {
    const cmdDesc = ' devices';
    const result = await cmd(cmdDesc);
    const lines = result.split(getCharBreakLine());
    let devices = [];
    for (let index = 0; index < lines.length; index++) {
        const item = lines[index];
        if (index !== 0 && item !== '') {
            const [name, status] = item.split('\t');
            devices.push({
                name,
                status,
                root: await isDeviceRoot(name),
            });
        }
    }
    return devices;
}

async function isDeviceRoot(device) {
    try {
        const result = await cmd(` -s ${device} root`);
        return result.indexOf('adbd is already running as root') >= 0;
    } catch (error) {
        return false;
    }
}

async function existsAdbPath() {
    try {
        Util.createFileConfigAdb();
        await cmd(` --version`);
        return true;
    } catch (error) {
        return false;
    }
}

async function cmd(dsCmd) {
    try {
        const config = Util.getConfig();
        const commandAdb = process.platform === 'win32' ? `cd ${config.path} && adb ${dsCmd}` : `cd ${config.path} && ./adb ${dsCmd}`;
        console.log('>', commandAdb);
        return execSync(commandAdb).toString();
    } catch (error) {
        throw new Error(`${error.message}\n${error.stdout.toString()}`);
    }
}

function getCharBreakLine() {
    switch (process.platform) {
        case 'win32':
            return '\r\n';
        case 'darwin':
        case 'linux':
        default:
            return '\n';
    }
}

module.exports.copyFileDevice = copyFileDevice;
module.exports.getDevices = getDevices;
module.exports.existsAdbPath = existsAdbPath;
