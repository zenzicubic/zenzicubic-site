/**
 * This is a simple component for a button with an icon which may be long-pressed.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
*/

import React from 'react';

function PressableIcon(props) {
    return (
        <button className="icon-button" onContextMenu={(evt) => { 
                // Prevent context menu from opening on touch devices
                evt.preventDefault(); 
            }}
            onMouseDown={props.onPress} onTouchStart={props.onPress} onMouseUp={props.onRelease} 
            onMouseOut={props.onRelease} onTouchCancel={props.onRelease} onTouchEnd={props.onRelease}>
            <span className="material-icons">{props.children}</span>
        </button>
    );
}

export default PressableIcon;