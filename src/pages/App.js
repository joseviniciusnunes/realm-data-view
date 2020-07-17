
import React, { useEffect, useState, useCallback } from 'react';
import './App.css';
import { MdAndroid } from "react-icons/md";
import { IoIosArrowDown, } from "react-icons/io";
import { FiTrash2 } from "react-icons/fi";
import Select from 'react-select';
import { FaDatabase } from "react-icons/fa";
import ReactJson from "react-json-view";
import TopBar from '../components/topBar/TopBar';
import DropMenu from '../components/dropMenu/DropMenu';

import Storage from '../services/Storage';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
const { dialog } = window.require('electron').remote

export default () => {
    const [devices, setDevices] = useState([]);
    const [schemas, setSchemas] = useState([]);
    const [jsonView, setJsonView] = useState(null);
    const [schemaFocus, setSchemaFocus] = useState(null);
    const [packageApp, setPackageApp] = useState('');
    const [device, setDevice] = useState(null);
    const [fileRealm, setFileRealm] = useState('default.realm');
    const [dropMenu, setDropMenu] = useState(null);

    function loadingDevices() {
        const result = ipcRenderer.sendSync('@get-data', { action: 'DEVICES' });
        let options = result.map(({ name, status }) => ({
            value: name,
            label: (
                <span>{name}{' '}-{' '}
                    <span className="text-select-status-device">{status}</span>
                </span>)
        }))
        setDevices(options);
    }

    function loadingSchemas(e) {
        console.log({
            package: packageApp,
            device: device,
            fileRealm
        })
        if (!packageApp) {
            return dialog.showErrorBox('Validation', 'Inform the app package');
        }
        if (!device) {
            return dialog.showErrorBox('Validation', 'Inform the device');
        }
        if (!fileRealm) {
            return dialog.showErrorBox('Validation', 'Enter the name of the realm data file, the default name is "default.realm"');
        }
        const result = ipcRenderer.sendSync('@get-data', {
            action: 'SCHEMAS', data: {
                package: 'com.reactnativefinan',
                device: 'emulator-5554',
                fileRealm: 'default.realm'
            }
        });
        Storage.setLastData({
            package: packageApp,
            device: device.value,
            fileRealm
        });
        setSchemas(result);
    }

    const handleJsonView = useCallback((sch) => {
        if (sch) {
            setJsonView(schemas.find((obj) => obj.schema === sch).objects);
            setSchemaFocus(sch);
        }
    }, [schemas]);

    function handleOpenMenuPackage(e) {
        setDropMenu({
            x: e.pageX,
            y: e.pageY,
            onClose: () => setDropMenu(null),
            items: getItemsDropMenuPackage()
        });
    }

    function getItemsDropMenuPackage() {
        return Storage.getLastData().map((item) => {
            return (
                <div key={item.package} className="box-item-menu-package">
                    <div className="box-drop-item" onClick={(e) => handleItemDropMenuPackage(e, item)}>
                        {item.package}
                    </div>
                    <div className="box-drop-item" onClick={(e) => handleDeleteItemDropMenuPackage(e, item)}>
                        <FiTrash2 className="icon-package-delete" />
                    </div>
                </div>
            )
        });
    }

    function handleItemDropMenuPackage(e, item) {
        setDropMenu(null)
        e.stopPropagation();
    }

    function handleDeleteItemDropMenuPackage(e, item) {
        Storage.deleteData(item.package);
        setDropMenu(null)
        e.stopPropagation();
    }

    useEffect(() => {
        handleJsonView(schemaFocus);
    }, [schemas, schemaFocus, handleJsonView])

    useEffect(() => {
        loadingDevices();
    }, []);


    return (
        <div className="box-app">
            <TopBar />
            <DropMenu data={dropMenu} />
            <div className="box-page">
                <div className="box-params">
                    <div className="box-package">
                        <div className="text-label-package">Package</div>
                        <div className="box-package-input">
                            <MdAndroid className="icon-package-android" />
                            <input type="text" className="input-package" value={packageApp} onChange={(e) => setPackageApp(e.target.value)} />
                            <IoIosArrowDown className="icon-package-menu" onClick={handleOpenMenuPackage} />
                        </div>
                    </div>
                    <div className="box-device-file">
                        <div className="text-label-device">Device:</div>
                        <Select
                            placeholder="Device"
                            options={devices}
                            className="select-device"
                            styles={styleSelectDevice}
                            value={device}
                            onChange={setDevice}
                        />
                        <div className="text-label-file">File:</div>
                        <input type="text" className="input-file" value={fileRealm} onChange={(e) => setFileRealm(e.target.value)} />
                    </div>
                    <div className="box-button-pull">
                        <div className="button-pull" onClick={loadingSchemas}>
                            Pull
                        </div>
                    </div>
                </div>
                <div className="box-content">
                    <div className="box-schemas">
                        <div className="box-schemas-header">
                            <FaDatabase className="icon-schemas-database" />
                            <div className="text-label-schemas">Schemas</div>
                        </div>
                        <div className="box-list-schemas">
                            {schemas.map((sch) => (
                                <div key={sch.schema} className={`box-name-schema ${schemaFocus === sch.schema ? 'box-schema-focus' : ''}`} onClick={() => setSchemaFocus(sch.schema)}>
                                    <div className="box-label-schema">
                                        {sch.schema}
                                    </div>
                                    <div className="box-badge-schema" hidden={sch.objects.length === 0}>
                                        <div className="box-total-objects">{sch.objects.length}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="box-data-view">
                        {jsonView &&
                            <ReactJson
                                src={jsonView}
                                collapsed={false}
                                displayDataTypes={false}
                                displayObjectSize={false}
                                enableClipboard={false}
                                theme="harmonic"
                                indentWidth={10}
                                style={{ backgroundColor: '#363740' }}
                            />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}


const styleSelectDevice = {
    control: (base, state) => ({
        ...base,
        color: '#FFF',
        background: "#252529",
        borderRadius: 10,
        border: 'none',
        boxShadow: 'none'
    }),
    singleValue: base => ({
        ...base,
        color: '#FFF',
        border: 'none',
    }),
};