/**
 * This is a generic "gallery" template, used by the projects 
 * and gallery pages.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

import React from 'react';

import CopyrightNotice from '../../components/copyright-notice/CopyrightNotice';
import Topbar from '../../components/topbar/Topbar';
import './gallery.css';

function Gallery(props) {
    return (<Topbar>
        <div id="gallery-banner" style={{backgroundImage: `url(${props.bgImg})`}}>
            <div id="gallery-text">
                <h1>{props.title}</h1>
                <p>{props.description}</p>
            </div>
        </div>
        <div id="gallery-container">
            {props.children}
        </div>
        <CopyrightNotice />
    </Topbar>);
}

export default Gallery;