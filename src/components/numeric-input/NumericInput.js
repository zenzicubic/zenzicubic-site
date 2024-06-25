/**
 * A simple numerical input with a default value of 0.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

import React from 'react';
import { useState } from 'react';

import './numeric-input.css';

const isNumber = (n) => !isNaN(n) && !isNaN(parseFloat(n));

function NumericInput(props) {
    const [inputValue, setValue] = useState(props.defaultValue);
    return (<>
        <input className="numeric-input" placeholder="0"
        name={props.name} value={inputValue} onChange={(evt) => {
            let val = evt.target.value;
            setValue(val);

            // Set value if it is a number
            val ||= 0;
            if (isNumber(val)) {
                // Otherwise set value
                props.onChange(val);
            }
        }}/>
    </>)
}

export default NumericInput;