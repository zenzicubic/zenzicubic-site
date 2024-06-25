/**
 * This is a simple accordion menu, used in various demos and projects pages.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

import React from 'react';
import { useState } from 'react';

import './accordion.css';

function Accordion(props) {
    const [isOpen, setOpen] = useState(false);
    return (
        <div className={"accordion" + (isOpen ? " active" : "")}>
            <div className="accordion-top">
                <span className="accordion-title">{props.title}</span>
                <button 
                    className="accordion-button" 
                    onClick={() => setOpen(!isOpen)}>
                    {isOpen ? "-" : "+"}
                </button>
            </div>
            <div className="accordion-content">
                <p>{props.children}</p>
            </div>
        </div>
    );
}

export default Accordion;