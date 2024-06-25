/**
 * This is a basic slider component, used by many of the demos/applets.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

import React from 'react';
import { useState } from 'react';

import './sliders.css';

function Slider(props) {
    const [sliderVal, setSliderVal] = useState(props.value);
    return (
        <>
            <span className="slider-label">{props.label}</span>
            <div className="slider-container">
                <input 
                    type="range" className="slider" min={props.min} max={props.max}
                    step={props.step} value={sliderVal} onChange={(evt) => {
                        let nVal = +evt.target.value;
                        setSliderVal(nVal);
                        props.onChange(nVal);
                    }} />
                <span className="slider-value">{
                    (props.formatFn ? props.formatFn(sliderVal) : sliderVal)
                }</span>
            </div>
        </>
    )
}

export default Slider;