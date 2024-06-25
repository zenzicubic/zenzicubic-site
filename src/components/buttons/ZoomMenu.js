/**
 * This is the zoom menu component, used in the Newton demo.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
*/

import React from 'react';
import { useRef } from 'react';

import PressableIcon from './PressableIcon'
import './button-menu.css';

// Zoom direction enum
export const ZoomDirection = {
    NOT_ZOOMING: 0,
    ZOOMING_IN: 1,
    ZOOMING_OUT: 2
};

function ZoomMenu(props) {
    const zoomDir = useRef(ZoomDirection.NOT_ZOOMING);

    /*
    Zooming in and out.
    */

    const setZoomDir = (dir) => {
        // Sets the zoom direction
        if (zoomDir.current !== dir) {
            zoomDir.current = dir;
            props.onZoom(zoomDir.current);
        } 
    }

    const zoomIn = () => {
        // Zooms in
        setZoomDir(ZoomDirection.ZOOMING_IN);
    }

    const zoomOut = () => {
        // Zooms out
        setZoomDir(ZoomDirection.ZOOMING_OUT);
    }

    const stopZoom = (evt) => {
        // Stops zooming
        evt.preventDefault();
        setZoomDir(ZoomDirection.NOT_ZOOMING);
    }

    return (
        <div className="button-menu">
            <PressableIcon onPress={zoomIn} onRelease={stopZoom}>zoom_in</PressableIcon>
            <PressableIcon onPress={zoomOut} onRelease={stopZoom}>zoom_out</PressableIcon>
            <button className="icon-button" onClick={props.onReset}>
                <span className="material-icons">loop</span>
            </button>
        </div>
    );
}

export default ZoomMenu;