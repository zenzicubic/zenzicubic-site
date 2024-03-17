/**
 * This is a layout used by all of the website's "front" pages,
 * i.e. the home, about, and error pages. It just has an image background
 * and a centered container.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

import React from 'react';
import './front-page.css';

function FrontPageLayout(props) {
    return (
        <div className="frontpage-wrapper">
            <div style={{backgroundImage: `url(${props.img}`}} className="frontpage-bg-img" />
            <div className="frontpage-content">
                {props.children}
            </div>
        </div>
    );
}

export default FrontPageLayout;