/**
 * This is a simple color picker component that allows the user to choose
 * a color from a list of preset colors.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
*/

import React from 'react';
import { useState } from 'react';
import { Popover } from 'antd';

import './colorpicker.css';

// List of colors (from Curvascope)
const colors = ["#ffffff", "#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#b71c1c", "#880e4f", "#4a148c", "#311b92", "#0d47a1", "#01579b", "#006064", "#004d40", "#1b5e20", "#33691e", "#827717", "#f57f17", "#ff6f00", "#e65100", "#bf360c", "#607d8b"];

function ColorPicker(props) {
    const [selIdx, setSelIdx] = useState(props.selIdx || 0);
    return (<>
        <div className="color-select-container">
            <span>{props.label}</span>
            <Popover content={(
            <div className="picker-color-swatch-container">
                {colors.map((col, i) => (<button 
                    className={"picker-color-swatch" + (i === selIdx ? " selected" : "")}
                    style={{backgroundColor: col}} key={"picker-button-" + i} 
                    onClick={() => {
                        // Set index on selection
                        setSelIdx(i);
                        props.onChange(i);
                    }
                }/>)
            )}</div>)} 
                title="Select color" trigger="click" placement="bottom">
                <button className="picker-color-select-btn">
                    <div className="picker-color-container"
                        style={{backgroundColor: colors[selIdx]}}>    
                    </div>
                </button>
            </Popover>
        </div>
    </>)
}

export default ColorPicker;
export { colors };