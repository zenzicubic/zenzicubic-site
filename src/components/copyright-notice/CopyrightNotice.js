/**
 * This is a simple copyright notice, used in the articles and galleries.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

import React from 'react';

import './copyright-notice.css';

function CopyrightNotice() {
    return (<div className="copyright-notice">
        <p>All images and articles licensed under&nbsp;
            <a href="http://creativecommons.org/licenses/by/4.0" target="_blank" rel="license noopener noreferrer">
                CC BY 4.0
                    <img className="cc-icon" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" alt="" id="icon-0" />
                    <img className="cc-icon" src="https://mirrors.creativecommons.org/presskit/icons/by.svg" alt=""/>
                    </a>.
                All source code for this website licensed under the <a href="https://github.com/zenzicubic/zenzicubic-site/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">MIT License</a>.
        </p>
    </div>);
}

export default CopyrightNotice;