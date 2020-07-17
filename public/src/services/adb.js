const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

async function clearDirectory() {
    try {
        fs.rmdirSync(path.resolve("temp", "db.realm.management"));
    } catch (error) { }
    try {
        fs.unlinkSync(path.resolve("temp", "db.realm"));
    } catch (error) { }
    try {
        fs.unlinkSync(path.resolve("temp", "db.realm.lock"));
    } catch (error) { }
}

async function copyFileDevice({ package, fileRealm, device }) {
    try {
        await clearDirectory();
        const fileTemp = path.resolve("temp", "db.realm");
        const cmdDesc = `adb -s ${device} pull /data/data/${package}/files/${fileRealm} ${fileTemp}`;
        await cmd(cmdDesc);
    } catch (error) {
        throw error;
    }
}

async function getDevices() {
    const cmdDesc = "adb devices";
    const result = await cmd(cmdDesc);
    const lines = result.split("\r\n");
    let devices = [];
    lines.forEach((element, index) => {
        if (index !== 0 && element !== "") {
            const [name, status] = element.split("\t");
            devices.push({
                name,
                status,
            });
        }
    });
    return devices;
}

const cmd = (command) =>
    new Promise((resolve, reject) => {
        console.log("> ", command);
        exec(command, (err, res) => {
            if (err) {
                return reject(err);
            }
            return resolve(res);
        });
    });

module.exports.copyFileDevice = copyFileDevice;
module.exports.getDevices = getDevices;
