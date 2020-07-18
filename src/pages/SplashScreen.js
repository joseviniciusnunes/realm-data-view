import React from 'react';
import './SplashScreen.css';

const Logo500 = require('../assets/logo/logo-500.png')

export default () => {
    return (
        <div className="root-splash">
            <img src={Logo500} width={100} alt="logo" />
            <div className="text-app-name">{'{'} Realm Data View {'}'}</div>
            <div className="loader-splash"><div></div><div></div></div>
        </div>
    );
}