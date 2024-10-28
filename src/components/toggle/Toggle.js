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
    
    return (
        <label className="toggle-container">
            <input 
                type="checkbox" className="toggle-input" 
                checked={isToggled} onChange={(evt) => {
                    let toggled = evt.target.checked;
                    setToggled(toggled);
                    props.onChange(toggled);
                }}/>
            <span className="toggle"></span>
            {props.label}
        </label>
    );
};

export default Toggle;