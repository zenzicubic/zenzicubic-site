/**
 * These are some menu groups, for buttons and tabs.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

import React from 'react';
import { useState } from 'react';

import './groups.css';

// A simple tab group
function TabGroup(props) {
    const [tabIdx, setTabIdx] = useState(props.tabIdx || 0);
    return (<div className="tab-group">
        <span>{props.title}</span>
        {props.btnNames.map((tabName, i) => (<button key={"tab-" + i} 
            className={(tabIdx === i ? "selected" : "")} 
            onClick={() => {
                if (i !== tabIdx) {
                    props.onTabChange(i);
                    setTabIdx(i);
                }
            }} >{tabName}</button>
        ))}
    </div>);
}

// A simple button group
function ButtonGroup(props) {
    return (<div className="button-group">
        {props.children}
    </div>);
}

export { TabGroup, ButtonGroup };