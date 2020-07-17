

function getLastData() {
    return JSON.parse(localStorage.getItem('@LastData')) ?? [];
}

function setLastData(data) {
    let lastData = JSON.parse(localStorage.getItem('@LastData')) ?? [];
    const newData = lastData.filter((item) => item.package !== data.package);
    newData.push(data)
    localStorage.setItem('@LastData', JSON.stringify(newData));
}

function deleteData(packageApp) {
    let lastData = JSON.parse(localStorage.getItem('@LastData')) ?? [];
    const newData = lastData.filter((item) => item.package !== packageApp);
    localStorage.setItem('@LastData', JSON.stringify(newData));
}

export default {
    setLastData,
    getLastData,
    deleteData
}