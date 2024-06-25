/**
 * This is a generic checkbox/toggle component.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

import React from 'react';
import { useState } from 'react';

import './checkbox.css';

function Checkbox(props) {
    const [isChecked, setChecked] = useState(props.isChecked);
    return (
        <div className="checkbox-container">
            <input 
                type="checkbox" className="checkbox" checked={isChecked}
                name={props.name} onChange={(evt) => {
                    let checked = evt.target.checked;
                    setChecked(checked);
                    props.onChange(checked);
                }}/>
            <span className="checkbox-lbl">{props.label}</span>
        </div>
    );
};

export default Checkbox;