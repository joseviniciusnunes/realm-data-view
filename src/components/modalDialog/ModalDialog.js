import React, { memo } from 'react';
import { MdErrorOutline } from "react-icons/md";

import './ModalDialog.css';

export default memo(({ data }) => {

    if (!data) {
        return null;
    }

    const { type, title, message, onClick, onClose } = data;

    const IconModal = ({ typeIcon }) => {
        switch (typeIcon) {
            case 'ERROR':
                return <MdErrorOutline className="icon-modal-dialog" />;
            default:
                return null;
        }
    }

    function handleClickOk(e) {
        onClick ? onClick() : onClose();
        e.stopPropagation();
    }

    function handleClose(e) {
        onClose();
        e.stopPropagation();
    }

    return (
        <div className="root-modal-dialog" onClick={handleClose}>
            <div className="box-modal-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="box-modal-dialog-icon">
                    <IconModal typeIcon={type} />
                </div>
                <div className="box-modal-dialog-context">
                    <div className="box-modal-dialog-text">
                        <div className="box-modal-dialog-title">{title}</div>
                        <div className="box-modal-dialog-message">{message}</div>
                    </div>
                    <div className="box-modal-dialog-action">
                        <div className="button-modal-dialog-ok" onClick={handleClickOk}>Ok</div>
                    </div>
                </div>
            </div>
        </div>
    )
})