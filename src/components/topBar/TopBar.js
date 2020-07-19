import React, { useState, useEffect } from 'react';
import './TopBar.css';
import { FiX, FiSquare, FiMinus } from 'react-icons/fi';
import { TiTabsOutline } from 'react-icons/ti';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

const logo96 = require('../../assets/logo/logo-96.png');

const platform = ipcRenderer.sendSync('@get-data', { action: 'PLATFORM' });

export default () => {
    if (platform !== 'win32') {
        return null;
    }

    const [maximized, setMaximized] = useState(false);

    useEffect(() => {
        ipcRenderer.on('@window-state', (event, state) => {
            setMaximized(state);
        });
    }, []);

    function handleClose() {
        ipcRenderer.send('@window-action', 'CLOSE');
    }

    function handleMaximized() {
        if (maximized) {
            ipcRenderer.send('@window-action', 'DROP');
        } else {
            ipcRenderer.send('@window-action', 'FULLSCREEN');
        }
    }
    function handleMinimize() {
        ipcRenderer.send('@window-action', 'MINIMIZE');
    }

    return (
        <div className="box-top-bar">
            <div className="left">
                <img src={logo96} width={25} alt="logo" className="img-logo" />
            </div>
            <div className="center">Realm Data Visualization</div>
            <div className="right">
                <div className="icon">
                    <FiMinus className="icon-minimized" onClick={handleMinimize} />
                </div>
                <div className="icon" onClick={handleMaximized}>
                    {maximized ? <TiTabsOutline className="icon-drop" /> : <FiSquare className="icon-expanted" />}
                </div>
                <div className="icon" onClick={handleClose}>
                    <FiX className="icon-close" />
                </div>
            </div>
        </div>
    );
};
