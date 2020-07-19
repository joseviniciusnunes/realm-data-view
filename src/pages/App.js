import React, { useEffect, useState, useCallback } from 'react';
import './App.css';
import { MdAndroid } from 'react-icons/md';
import { IoIosArrowDown, IoIosRefresh } from 'react-icons/io';
import { FiTrash2 } from 'react-icons/fi';
import { FaDatabase } from 'react-icons/fa';
import ReactJson from 'react-json-view';
import TopBar from '../components/topBar/TopBar';
import DropMenu from '../components/dropMenu/DropMenu';
import ModalDialog from '../components/modalDialog/ModalDialog';

import Storage from '../services/Storage';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export default () => {
    const [devices, setDevices] = useState([]);
    const [schemas, setSchemas] = useState([]);
    const [jsonView, setJsonView] = useState(null);
    const [schemaFocus, setSchemaFocus] = useState(null);
    const [packageApp, setPackageApp] = useState('');
    const [device, setDevice] = useState(null);
    const [fileRealm, setFileRealm] = useState('default.realm');
    const [dropMenu, setDropMenu] = useState(null);
    const [modalDialog, setModalDialog] = useState(null);

    function loadingDevices() {
        const result = ipcRenderer.sendSync('@get-data', { action: 'DEVICES' });
        if (result instanceof Error) {
            return setModalDialog({
                type: 'ERROR',
                title: 'Error',
                message: result.message,
                onClose: () => setModalDialog(null),
            });
        }
        setDevices(result);
    }

    function loadingSchemas() {
        if (!packageApp) {
            return setModalDialog({
                type: 'ERROR',
                title: 'Validation',
                message: 'Inform the app package',
                onClose: () => setModalDialog(null),
            });
        }
        if (!device) {
            return setModalDialog({
                type: 'ERROR',
                title: 'Validation',
                message: 'Inform the device',
                onClose: () => setModalDialog(null),
            });
        }
        if (!fileRealm) {
            return setModalDialog({
                type: 'ERROR',
                title: 'Validation',
                message: 'Enter the name of the realm data file, the default name is "default.realm"',
                onClose: () => setModalDialog(null),
            });
        }
        const result = ipcRenderer.sendSync('@get-data', {
            action: 'SCHEMAS',
            data: {
                package: packageApp,
                device: device,
                fileRealm: fileRealm,
            },
        });
        if (result instanceof Error) {
            Storage.setLastData({
                package: packageApp,
                device: device,
                fileRealm,
            });
            return setModalDialog({
                type: 'ERROR',
                title: 'Error',
                message: (
                    <span>
                        {result.message}
                        {HelpsAdb}
                    </span>
                ),
                onClose: () => setModalDialog(null),
            });
        }
        Storage.setLastData({
            package: packageApp,
            device: device,
            fileRealm,
        });
        setSchemas(result);
    }

    function handleOpenMenuPackage(e) {
        setDropMenu({
            x: e.pageX,
            y: e.pageY,
            onClose: () => setDropMenu(null),
            items: getItemsDropMenuPackage(),
        });
    }

    function getItemsDropMenuPackage() {
        return Storage.getLastData()
            .reverse()
            .map((item) => (
                <div key={item.package} className="box-item-menu-package">
                    <div className="box-drop-item" onClick={(e) => handleItemDropMenuPackage(e, item)}>
                        {item.package}
                    </div>
                    <div className="box-drop-item" onClick={(e) => handleDeleteItemDropMenuPackage(e, item)}>
                        <FiTrash2 className="icon-package-delete" />
                    </div>
                </div>
            ));
    }

    function defineDataLast(item) {
        setPackageApp(item.package);
        setDevice(item.device);
        setFileRealm(item.fileRealm);
    }

    function handleItemDropMenuPackage(e, item) {
        defineDataLast(item);
        setDropMenu(null);
        e.stopPropagation();
    }

    function handleDeleteItemDropMenuPackage(e, item) {
        Storage.deleteData(item.package);
        setDropMenu(null);
        e.stopPropagation();
    }

    function getDevice() {
        return devices.find((it) => it.name === device);
    }

    function TextDevice({ device, className }) {
        return (
            <div className={`${className ? className : ''} text-name-device`}>
                <div className="text-select-name-device">{device && `${device?.name} / ${device?.status}`}</div>
                <div className={device?.root ? 'text-select-status-device' : 'text-select-status-offline'}>
                    {device && (device?.root ? ' root' : ' not-root')}
                </div>
            </div>
        );
    }

    function handleOpenMenuDevices(e) {
        setDropMenu({
            x: e.pageX,
            y: e.pageY,
            onClose: () => setDropMenu(null),
            items: getItemsDropMenuDevices(),
        });
    }

    function getItemsDropMenuDevices() {
        return devices.map((item) => (
            <div key={item.name} onClick={() => handleSelectDevice(item)}>
                <TextDevice device={item} className="box-item-menu-devices" />
            </div>
        ));
    }

    function handleSelectDevice(item) {
        setDevice(item.name);
    }

    const handleJsonView = useCallback(
        (sch) => {
            if (sch) {
                setJsonView(schemas.find((obj) => obj.schema === sch).objects);
                setSchemaFocus(sch);
            }
        },
        [schemas]
    );

    useEffect(() => {
        loadingDevices();
        const lastData = Storage.getLastData().reverse();
        if (lastData.length) {
            defineDataLast(lastData[0]);
        }
    }, []);

    useEffect(() => {
        handleJsonView(schemaFocus);
    }, [schemas, schemaFocus, handleJsonView]);

    return (
        <div className="box-app">
            <TopBar />
            <DropMenu data={dropMenu} />
            <ModalDialog data={modalDialog} />
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
                        <div className="text-label-device label">Device:</div>
                        <div className="select-device">
                            <TextDevice device={getDevice()} />
                            <div className="button-select-device" onClick={handleOpenMenuDevices}>
                                <IoIosArrowDown className="icon-button-select-device" />
                            </div>
                        </div>
                        <div className="button-refresh-devices" onClick={loadingDevices}>
                            <IoIosRefresh className="icon-device-refresh" />
                        </div>
                        <div className="text-label-file label">File:</div>
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
                            <div className="text-label-schemas label">Schemas</div>
                        </div>
                        <div className="box-list-schemas">
                            {schemas.map((sch) => (
                                <div
                                    key={sch.schema}
                                    className={`box-name-schema ${schemaFocus === sch.schema ? 'box-schema-focus' : ''}`}
                                    onClick={() => setSchemaFocus(sch.schema)}
                                >
                                    <div className="box-label-schema">{sch.schema}</div>
                                    <div className="box-badge-schema" hidden={sch.objects.length === 0}>
                                        <div className="box-total-objects">{sch.objects.length}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="box-data-view">
                        {jsonView && (
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
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const HelpsAdb = (
    <span>
        <br />
        <br />
        <b>Help:</b>
        <br />
        * adb was not added to the path
        <br />
        * Your physical device or emulator does not contain root
        <br />
        * The reported file .realm does not exist on the device
        <br />
    </span>
);
