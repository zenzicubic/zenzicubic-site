/**
 * This is a generic toggle component.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

import React from 'react';
import { useState } from 'react';

import './toggle.css';

function Toggle(props) {
    const [isToggled, setToggled] = useState(props.isToggled);
    const id = "toggle-" + props.name;

    return (
        <div className="toggle-container">
            <input 
                type="checkbox" className="toggle" checked={isToggled}
                id={id} onChange={(evt) => {
                    let toggled = evt.target.checked;
                    setToggled(toggled);
                    props.onChange(toggled);
                }}/>
            <label htmlFor={id} className="toggle-lbl">{props.label}</label>
        </div>
    );
};

export default Toggle;