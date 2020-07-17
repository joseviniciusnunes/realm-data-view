import React, { useEffect, useCallback, memo } from 'react';
import './DropMenu.css';

export default memo(({ data }) => {

    const eventkeyPress = useCallback((e) => {
        if (e) {
            document.removeEventListener("keydown", eventkeyPress, false);
            data.onClose();
        }
    }, [data]);

    useEffect(() => {
        if (!data) {
            document.removeEventListener("keydown", eventkeyPress, false);
        } else {
            document.addEventListener("keydown", eventkeyPress, false);
        }
    }, [data, eventkeyPress])

    if (!data) {
        return null;
    }

    const { x, y, items, onClose } = data;

    if (items.length === 0) {
        return null;
    }

    function handleCloseBackground(e) {
        onClose();
        e.stopPropagation();
    }

    return (
        <div className="root-drop-menu" onClick={handleCloseBackground}>
            <div className="box-drop-menu" style={{ top: y + 10, left: x - 180 }}>
                {items}
            </div>
        </div>
    )
})