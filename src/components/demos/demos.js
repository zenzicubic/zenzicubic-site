/**
 * This is the generic demo framework and some related components.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
*/

import React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { vec2 } from '../../math';

import errorImg from '../../images/mobile_error_bg.png';
import './demos.css';

/*
The mobile error window.
*/

function MobileError() {
    return (
        <div id="mobile-error-bg" style={{backgroundImage: `url(${errorImg})`}}>
            <div id="mobile-error-msg">
                <h1>Oh no!</h1>
                <p>This demo does not support mobile. Try using a device with a larger screen or resizing the window if on a computer.</p>
            </div>
        </div>
    )
}

/*
A basic demo with no canvas.
*/

export function Demo(props) {
    const [isMenuVisible, setMenuVisibility] = useState(true);

    return (<>
        <div id="demo-button-container">
            <button className="icon-button" onClick={() => setMenuVisibility(true)} 
                title="Show menu">
                <span className="material-icons">menu</span>
            </button>

            <Link to="/projects">
                <button className="icon-button" title="Back to projects">
                    <span className="material-icons">arrow_back</span>
                </button>
            </Link>
        </div>

        <div id="demo-pane" className={(isMenuVisible ? "visible" : "")}>
            <div id="demo-pane-topbar">
                <h2 id="demo-title">{props.title}</h2>
                <button id="demo-close-btn" className="icon-button"
                    onClick={() => setMenuVisibility(false)}>
                    <span className="material-icons">close</span>
                </button>
            </div>
            
            <div id="demo-pane-content">
                {props.children}
            </div>
        </div>
        <MobileError />
    </>);
}

/*
A simple demo with a canvas and prebuilt mouse functionality.
*/

export function CanvasDemo(props) {
    const canvasRef = props.canvasRef;
    const {onResize, onInitialize} = props;

    /*
    Sizing.
    */

    useEffect(() => {
        /*
        Sets the width and height variables and the size of the canvas,
        and some useful values related to it.
        */
        const setSize = () => {
            let width = window.innerWidth;
            let height = window.innerHeight;
            canvasRef.current.width = width;
            canvasRef.current.height = height;

            onResize({
                width, height, aspect: width / height,
                hW: width * 0.5, hH: height * 0.5, 
                invW: 1 / width, invH: 1 / height,
                isMobile: (width < 768)
            });
        }

        // Add event listener and initialize demo
        window.addEventListener("resize", setSize);
        setSize();
        const clearFn = onInitialize();

        // Remove event listener
        return () => {
            window.removeEventListener("resize", setSize);
            if (clearFn)
                clearFn();
        }
    }, [canvasRef, onResize, onInitialize]);

    /*
    Gets mouse coordinates in canvas space.
    */

    const getEvtCoords = useCallback((evt) => {
        if (evt.touches && evt.touches.length > 0) {
            evt = evt.touches.item(0);
        }
        
        // Gets the mouse position relative to the canvas
        let box = canvasRef.current.getBoundingClientRect();
        return vec2(
            evt.clientX - box.left,
            evt.clientY - box.top);
    }, [canvasRef]);

    /* 
    Handlers for events.
    */

    const onInteractionStart = useCallback((evt) => {
        let pos = getEvtCoords(evt);

        if (props.onInteractionStart) {
            document.body.classList.add("dragging");
            props.onInteractionStart(pos.x, pos.y);
        }
    }, [getEvtCoords, props]);

    const onInteractionEnd = useCallback(() => {
        if (props.onInteractionEnd) {
            document.body.classList.remove("dragging");
            props.onInteractionEnd();
        }
    }, [props]);

    const onInteractionMove = useCallback((evt) => {
        let pos = getEvtCoords(evt);

        // Break if not dragging over canvas
        if (document.elementFromPoint(pos.x, pos.y) !== canvasRef.current) {
            onInteractionEnd();
        } else if (props.onInteractionMove) {
            props.onInteractionMove(pos.x, pos.y);
        }
    }, [getEvtCoords, onInteractionEnd, canvasRef, props]);

    return (<>
        <Demo title={props.title}>{props.children}</Demo>
        <canvas className="demo-canvas" ref={canvasRef} 
            onMouseDown={onInteractionStart} onTouchStart={onInteractionStart}
            onMouseMove={onInteractionMove} onTouchMove={onInteractionMove}
            onMouseUp={onInteractionEnd} onMouseOut={onInteractionEnd} 
            onTouchEnd={onInteractionEnd} onTouchCancel={onInteractionEnd} />
    </>);
}