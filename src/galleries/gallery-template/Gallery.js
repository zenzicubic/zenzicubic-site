/**
 * This is a generic "gallery" template, used by the projects 
 * and gallery pages.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

import React from 'react';

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

        
        <div id="copyright-notice">
            <p>All images and articles licensed under&nbsp;
                <a href="http://creativecommons.org/licenses/by-nc/4.0" target="_blank" rel="license noopener noreferrer">
                    CC BY-NC 4.0
                        <img className="cc-icon" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" alt="" id="icon-0" />
                        <img className="cc-icon" src="https://mirrors.creativecommons.org/presskit/icons/by.svg" alt=""/>
                        <img className="cc-icon" src="https://mirrors.creativecommons.org/presskit/icons/nc.svg" alt=""/>
                        </a>.
                    All source code for this website licensed under the <a href="https://github.com/zenzicubic/zenzicubic-site/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">MIT License</a>.
            </p>
        </div>
    </Topbar>);
}

export default Gallery;