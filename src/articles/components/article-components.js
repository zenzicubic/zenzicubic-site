/**
 * These are just generic components for articles: the basic layout and 
 * images. There are also headers and numbered sections supported as CSS
 * classes.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

import React from 'react';

import CopyrightNotice from '../../components/copyright-notice/CopyrightNotice';
import Topbar from '../../components/topbar/Topbar';
import './article-components.css';

/*
The article layout component.
*/

function ArticleLayout(props) {
    return (<Topbar>
        <div id="article-layout-banner">
            <div id="article-layout-text">
                <h1>{props.title}</h1>
                <h5>{props.date}</h5>
            </div>
        </div> 
        <div id="article-content">
            {props.children}
        </div>
        <CopyrightNotice />
    </Topbar>);
}

/*
The image embed component.
*/

function ArticleImage(props) {
    return (
        <div className="article-img-container">
            <img className="article-img" src={props.imgUrl} alt={props.imgAlt} />
            <p>{props.imgDesc}</p>
        </div>
    );
}

export { ArticleLayout, ArticleImage };