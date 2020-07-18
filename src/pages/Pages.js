import React, { useEffect, useState, useCallback } from 'react';
import App from './App';
import SplashScreen from './SplashScreen';
import ModalDialog from '../components/modalDialog/ModalDialog';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

export default () => {
    const [ready, setReady] = useState(false);
    const [modalDialog, setModalDialog] = useState(null);

    const verifyReady = useCallback(async () => {
        const result = ipcRenderer.sendSync('@get-data', { action: 'ADB_PATH' });
        if (result) {
            return setTimeout(() => setReady(true), 2000);
        } else {
            return setTimeout(() => setModalDialog({
                type: 'ERROR',
                title: 'Error',
                message: 'Adb (Android Debug Bridge) was not found in the system path',
                onClose: appClose,
            }), 2000);
        }
    }, []);

    function appClose() {
        electron.remote.getCurrentWindow().close();
    }

    useEffect(() => {
        verifyReady();
    }, [verifyReady]);

    if (ready) {
        return <App />
    } else {
        return (
            <>
                <ModalDialog data={modalDialog} />
                {!modalDialog && <div className="root-drag-window" />}
                <SplashScreen />
            </>
        )
    }
}