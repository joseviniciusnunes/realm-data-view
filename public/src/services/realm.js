const Realm = require("realm");
const path = require("path");

const adb = require("./adb");
const fileTemp = path.resolve("temp", "db.realm");

let realm = null;

async function open() {
    if (!realm) {
        realm = await Realm.open({ path: fileTemp });
    }
}

async function close() {
    if (realm) {
        await realm.close();
        realm = null;
    }
}

async function getAllSchema() {
    await open();
    let schemas = [];
    realm.schema.forEach((schema) => schemas.push(schema.name));
    await close()
    return schemas;
}

async function getAllObjSchema(schema) {
    try {
        await open();
        const result = JSON.parse(JSON.stringify(realm.objects(schema)));
        let array = []
        for (let obj in result) {
            array.push(result[obj]);
        }
        await close()
        return array;
    } catch (error) {
        throw error;
    }
}

async function getAllObjAllSchema({ package, device, schema, fileRealm }) {
    try {
        await pullFile({ package, device });
        let data = [];
        const schemas = await getAllSchema();
        for (let sche of schemas) {
            if (!schema || schema === sche) {
                data.push({
                    schema: sche,
                    objects: await getAllObjSchema(sche),
                })
            }
        }
        return data;
    } catch (error) {
        throw error;
    }
}

async function pullFile({ package, device, fileRealm }) {
    await adb.copyFileDevice({
        package: package,
        device: device,
        fileRealm: fileRealm,
    });
}

module.exports.getAllObjAllSchema = getAllObjAllSchema;
