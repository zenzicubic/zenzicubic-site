/**
 * This is the accordion component.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */
import React from 'react';
import { useState, useCallback } from 'react';

import './accordion.css';

/*
This is the component for an individual accordion section.
*/

function AccordionSection(props) {
    const {isActive, onClick, title, children} = props;

    return (<div className={"accordion-section" + (isActive ? " active" : "")}>
        <button onClick={onClick} className="accordion-section-header">
            <span>{title}</span>
            <span className="section-arrow"></span>
        </button>
        <div className="section-wrapper">
            <div className="section-content">
                {children}
            </div>
        </div>
    </div>);
}

/*
This is the component for the actual accordion.
*/

function Accordion(props) {
    const [selIdx, setSelIdx] = useState(0);
    const [expanded, setExpanded] = useState(false);
    
    const handleClick = useCallback((newIdx) => {
        // Handles clicking of one of the accordion sections
        setSelIdx(curIdx => {
            if (curIdx === newIdx) {
                setExpanded(open => !open);
            } else {
                setExpanded(true);
            }
            return newIdx;
        });
    }, []);

    return (<div className="accordion">
        {props.sections.map((opt, i) => (
            <AccordionSection title={opt.title} key={"section" + i}
                isActive={expanded && (selIdx === i)} 
                onClick={() => handleClick(i)}>
                    {opt.content}
                </AccordionSection>))}
    </div>)
}

export default Accordion;