/**
 * This is the Clifford attractor applet embedded in the chaos theory article.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

import React from 'react';
import { useRef, useState, useCallback, useEffect } from 'react';

import './attractor-layout.css';
import { vec2 } from '../../math';
import Slider from '../../components/slider/Slider';

const nPointsPerFrame = 500;
const scl = 50;

/*
Iterated function.
*/

const map = (pt, params) => {
    return vec2(
        Math.sin(params.a * pt.y) + params.c * Math.cos(params.a * pt.x),
        Math.sin(params.b * pt.x) + params.d * Math.cos(params.b * pt.y));
}

/*
The component itself.
*/

function AttractorApplet() {
    // Point, animation frame, and parameters
    const frameRef = useRef(null);
    const pt = useRef(vec2(.5, .5));
    const [params, setParams] = useState({a: -2, b: -2, c: -1.2, d: -2});

    // Canvas, context, etc.
    const parentRef = useRef(null);
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);

    // Scale
    const size = useRef({width: 0, height: 0, hW: 0, hH: 0});

    /*
    Animation loop and clearing the display.
    */

    const mainLoop = useCallback(() => {
        ctxRef.current.fillStyle = "#F6C604";
        // Apply mapping
        for (let i = 0; i < nPointsPerFrame; i ++) {
            pt.current = map(pt.current, params);    
            ctxRef.current.fillRect(scl * pt.current.x, scl * pt.current.y, 0.25, 0.25);
        }

        frameRef.current = requestAnimationFrame(mainLoop);
    }, [params]);

    const resetSystem = useCallback(() => {
        // Clear and use random initial condition
        pt.current = vec2(Math.random(), Math.random());
        ctxRef.current.clearRect(
            -size.current.hW, -size.current.hH, 
            size.current.width, size.current.height);
    }, []);

    /*
    Setting the canvas's size.
    */

    const setCanvasSize = useCallback((width, height) => {
        size.current = {width, height, hW: 0.5 * width, hH: 0.5 * height};
        canvasRef.current.width = width;
        canvasRef.current.height = height;

        ctxRef.current.reset();
        ctxRef.current.translate(0.5 * width, 0.5 * height);
    }, []);

    /*
    Initializing things on mount.
    */

    const initialize = useCallback(() => {
        // Add resize observer
        const observer = new ResizeObserver((entries) => {
            let newBox = entries[0].contentRect;
            setCanvasSize(newBox.width, newBox.height);
        });
        observer.observe(parentRef.current);

        // Initialize canvas
        ctxRef.current = canvasRef.current.getContext("2d");

        // Set initial size
        let box = parentRef.current.getBoundingClientRect();
        setCanvasSize(box.width, box.height);
        mainLoop();

        // Clear on finish
        const currentRef = parentRef.current;
        return () => {
            cancelAnimationFrame(frameRef.current);
            observer.unobserve(currentRef); 
        }
    }, [mainLoop, setCanvasSize]);

    useEffect(initialize, [initialize]);

    return (
        <div id="attractor-viz-parent">
            <div id="attractor-viz-container" ref={parentRef}>
                <canvas id="attractor-viz-canvas" ref={canvasRef}></canvas>
            </div>
            <div id="attractor-param-container">
                <Slider 
                    min="-3" max="3" value={params.a} step={1e-2} 
                    label="&alpha;" onChange={(a) => {
                        setParams(paras => ({...paras, a}));
                        resetSystem();
                    }}/>
                <Slider 
                    min="-3" max="3" value={params.b} step={1e-2} 
                    label="&beta;" onChange={(b) => {
                        setParams(paras => ({...paras, b}));
                        resetSystem();
                    }}/>
                <Slider 
                    min="-3" max="3" value={params.c} step={1e-2} 
                    label="&gamma;" onChange={(c) => {
                        setParams(paras => ({...paras, c}));
                        resetSystem();
                    }}/>
                <Slider 
                    min="-3" max="3" value={params.d} step={1e-2} 
                    label="&delta;" onChange={(d) => {
                        setParams(paras => ({...paras, d}));
                        resetSystem();
                    }}/>
            </div>
        </div>
    );
}

export default AttractorApplet;