/**
 * This is the generic topbar component. All articles and "gallery"
 * pages inherit it. It has responsiveness for the menu baked in.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

import React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

import Logo from '../../images/logo.png';
import './topbar.css';

function Topbar(props) {
    const headerRef = useRef();
    const [showOptions, setOptionVisibility] = useState(false);

    // Close top menu when clicked off
    const handleWindowClick = useCallback((evt) => {
        if (!headerRef.current.contains(evt.target)) {
            setOptionVisibility(false);
        }
    }, [])

    // Add event listener for click off
    useEffect(() => {
        window.addEventListener("mousedown", handleWindowClick);
        return () => {
            window.removeEventListener("mousedown", handleWindowClick);
        }
    }, [handleWindowClick]);

    return (
        <div id="page-container">
            <div id="topbar-container" ref={headerRef}>
                <div id="topbar-components">
                    <span id="topbar-logo-container">
                        <img src={Logo} id="header-logo" alt="Logo" />
                        <span id="header-name">Zenzicubic</span>
                    </span>
                    <button onClick={() => setOptionVisibility(!showOptions)} id="topbar-link-button">
                        <span className="material-icons">
                            {showOptions ? "close" : "menu"}
                        </span>
                    </button>
                </div>
                <div id="topbar-links" className={(showOptions ? "visible" : " ")}>
                    <Link to="/" className="header-link">
                        <button>Home</button>
                    </Link>

                    <Link to="/about" className="header-link">
                        <button>About</button>
                    </Link>

                    <Link to="/projects" className={
                        "header-link" + 
                        (window.location.pathname === "/projects" ? " selected" : "")
                    }>
                        <button>Projects</button>
                    </Link>

                    <Link to="/gallery" className={
                        "header-link" + 
                        (window.location.pathname === "/gallery" ? " selected" : "")
                    }>
                        <button>Gallery</button>
                    </Link>
                </div>
            </div>
            
            <div id="main-content">
                {props.children}
            </div>
        </div>
    );
}

export default Topbar;