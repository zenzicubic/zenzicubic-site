/**
 * This is the waves on a string demo.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */
import React from 'react';
import { useRef, useCallback } from 'react';
import { MathJax } from 'better-react-mathjax';

import Slider from '../../components/slider/Slider';
import Toggle from '../../components/toggle/Toggle';
import Accordion from '../../components/accordion/Accordion';

import { CanvasDemo } from '../../components/demos/demos';
import { ButtonGroup } from '../../components/groups/groups';
import { Vector, vec2, clamp } from '../../math';

// Integration constants
const dt = 5e-2;
const nSteps = 30;
const nPts = 750;

// Graphics constants
const sclFac = 0.6;
const blockRange = 0.5;

// Box and circle info
const boxSz = 20;
const boxLeft = 10;
const boxDiam = 2 * boxSz;
const boxX = boxSz + boxLeft;

const circleSz = 10;
const circleRight = 30;

// Offsets
const offsetLeft = boxDiam + boxLeft;
const offsetRight = circleSz * 2 + circleRight;
const offset = offsetLeft + offsetRight;

// Initial condition
const gaussian = (x) => 0.5 * Math.exp(-100 * x * x);

/*
"Jet" colormap.
*/

const colorMap = (t) => {
    // Clamp color
    t = 4 * clamp(t + .5, 0, 1);

    // Piecewise color function
    let [r, g, b] = [255, 255, 255];
    if (t < 1) {
        r = 0;
        g = Math.round(255 * t);
    } else if (t < 2) {
        t -= 1;
        r = 0;
        b = Math.round(255 * (1 - t));
    } else if (t < 3) {
        t -= 2;
        r = Math.round(255 * t);
        b = 0;
    } else {
        t -= 3;
        g = Math.round(255 * (1 - t));
        b = 0;
    }
    return `rgb(${r}, ${g}, ${b})`;
}

/*
The actual demo.
*/

function StringWavesDemo() {
    // Canvas and context
    const canvasRef = useRef(null);
    const ctx = useRef(null);

    // Scale info
    const sclInfo = useRef(null);
    const isMobile = useRef(false);
    
    // Animation stuff
    const frameRef = useRef(null);
    const iconRef = useRef(null);
    const isPlaying = useRef(true);

    // Drag handling
    const isDragging = useRef(false);
    const startY = useRef(null);
    const startMouseY = useRef(null);

    // String position and start position
    const disp = useRef([]);
    const yLeft = useRef(0);

    // Parameters
    const params = useRef({speed: 1, damping: 0});
    const doColors = useRef(true);

    /*
    Handling the state.
    */

    const initializeString = useCallback(() => {
        // Initializes the string
        disp.current = [];
        let k;
        for (let i = 0; i < nPts; i ++) {
            k = gaussian(2 * (i / nPts) - 1);
            disp.current[i] = vec2(k, k);
        }
    }, []);

    const resetString = useCallback(() => {
        // Set the height to 0
        disp.current = [...new Array(nPts)].fill(Vector.ZERO);
    }, []);

    const getValue = useCallback((i) => {
        // Gets the value from the array
        if (i < 0) {
            return yLeft.current;
        } else if (i >= nPts) {
            return 0;
        } else {
            return disp.current[i].x;
        }
    }, []);

    const doStep = useCallback(() => {
        let {speed, damping} = params.current;

        // Performs a single step of integration
        let val, newVal, deriv;
        let newState = [];
        for (let i = 0; i < nPts; i ++) {
            val = disp.current[i];
            
            // Compute new value using Verlet integration
            deriv = speed * dt * (getValue(i - 1) - 2 * val.x + getValue(i + 1));
            deriv -= damping * (val.x - val.y);

            newVal = 2 * val.x - val.y + deriv * dt;
            newState[i] = vec2(newVal, val.x);
        }
        disp.current = newState;
    }, [getValue]);

    /*
    Drawing the scene.
    */

    const drawPath = useCallback(() => {
        // Draws the curve
        let scl = sclInfo.current;
        let x = offsetLeft;
        let y, lastY = yLeft.current;
        ctx.current.strokeStyle = "#FC6255";
        
        for (let i = 0; i < nPts; i ++) {
            // Set the color
            y = disp.current[i].x;
            if (doColors.current) {
                ctx.current.strokeStyle = colorMap(y);
            }
            
            // Draw the segment
            ctx.current.beginPath();
            ctx.current.moveTo(x, -scl.yScale * lastY)
            ctx.current.lineTo(x + scl.dX, -scl.yScale * y);
            ctx.current.stroke();

            x += scl.dX;
            lastY = y;
        }

        // Draw the last segment
        ctx.current.lineTo(scl.width - offsetRight, 0);
        ctx.current.stroke();
    }, []);

    const draw = useCallback(() => {
        let scl = sclInfo.current;

        // Draw the curve
        ctx.current.clearRect(0, -scl.hH, scl.width, scl.height);
        drawPath();

        // Draw the box on the left
        let boxY = yLeft.current * scl.yScale;
        ctx.current.fillStyle = "white";
        ctx.current.fillRect(boxLeft, -boxSz - boxY, boxDiam, boxDiam);

        // Draw the fixed point on the right
        ctx.current.beginPath();
        ctx.current.arc(scl.width - offsetRight, 0, circleSz, 0, 2 * Math.PI);
        ctx.current.fill();
    }, [drawPath]);

    /*
    Animation stuff.
    */

    const mainLoop = useCallback(() => {
        // The main animation frame
        if (isPlaying.current) { 
            for (let i = 0; i < nSteps; i ++) {
                doStep();
            }
        }
        draw();

        frameRef.current = requestAnimationFrame(mainLoop);
    }, [doStep, draw]);

    const startLoop = useCallback(() => {
        // Requests a new animation frame
        frameRef.current = requestAnimationFrame(mainLoop);
    }, [mainLoop]);

    const stopLoop = useCallback(() => {
        // Stops the animation frame
        cancelAnimationFrame(frameRef.current);
    }, []);

    const handlePause = useCallback(() => {
        // Handle playing/pausing
        if (isPlaying.current) {
            iconRef.current.innerHTML = "play_arrow";
        } else {
            iconRef.current.innerHTML = "pause";
        }
        isPlaying.current = !isPlaying.current;
    }, []);

    /*
    Mouse stuff.
    */

    const remapY = useCallback((y) => {
        // Remaps a Y-coordinate to screen space
        let scl = sclInfo.current;
        return (y - scl.hH) / scl.yScale;  
    }, []);

    const onDragStart = useCallback((posX, posY) => {
        let scl = sclInfo.current;

        // Check if we are dragging
        let mappedY = scl.hH - yLeft.current * scl.yScale;
        let inBox = (Math.abs(posX - boxX) < boxSz && Math.abs(posY - mappedY) < boxSz);

        if (inBox) {
            // Store initial position and Y-coordinate
            startY.current = yLeft.current;
            startMouseY.current = remapY(posY);
            isDragging.current = true;
        }
    }, [remapY]);

    const onDrag = useCallback((posX, posY) => {
        if (isDragging.current) {
            // Compute change in position
            let delta = startMouseY.current - remapY(posY);
            let newY = clamp(startY.current + delta, -blockRange, blockRange);

            yLeft.current = newY;
            disp.current[0].x = disp.current[0].y = newY;
        }
    }, [remapY]);

    /*
    Handling resizing.
    */

    const transformCanvas = useCallback(() => {
        // Transforms the canvas
        ctx.current.resetTransform();
        ctx.current.translate(0, sclInfo.current.hH);
    }, []);

    const handleResize = useCallback((scl) => {
        // Handle screens that are too small
        if (scl.isMobile) {
            stopLoop();
        } else if (isMobile.current) {
            startLoop();
        }
        isMobile.current = scl.isMobile;

        // Set scale
        let {width, height} = scl;

        let dX = (width - offset) / (nPts + 1);
        let yScale = height * sclFac;
        sclInfo.current = {...scl, dX, yScale};

        // Transform canvas
        if (ctx.current) {
            transformCanvas();
        }
    }, [startLoop, stopLoop, transformCanvas]);

    /*
    Initializing the demo.
    */

    const initialize = useCallback(() => {
        // Initializing the canvas
        ctx.current = canvasRef.current.getContext("2d");
        initializeString();
        transformCanvas();

        // Starting/stopping animation looping
        if (!isMobile.current) {
            startLoop();
        }
        return stopLoop;
    }, [initializeString, transformCanvas, startLoop, stopLoop]);

    return (<>
        <title>Waves on a string | Zenzicubic</title>
        <CanvasDemo title="Waves on a string" canvasRef={canvasRef} onInitialize={initialize}
            onResize={handleResize} onInteractionStart={onDragStart} onInteractionMove={onDrag}
            onInteractionEnd={() => isDragging.current = false }>
            <p>This is an interactive computer simulation of waves on a string with one end movable and the other end fixed.</p>

            <Accordion sections={[
                {title: "What is this?", content: <p>
                    To predict how the waves travel along the string, we must solve the (damped) <a href="https://en.wikipedia.org/wiki/Wave_equation" target="_blank" rel="noopener noreferrer">wave equation</a>, also known as d&apos;Alembert&apos;s equation. The wave equation is a second-order partial differential equation:
                    <MathJax>{`\\(\\begin{align*} 
                        \\frac{\\partial^2 \\Psi}{\\partial t^2} = 
                        \\nu^2 \\frac{\\partial^2 \\Psi}{\\partial x^2} - 
                        \\mu \\frac{\\partial \\Psi}{\\partial t}
                    \\end{align*}\\)`}</MathJax>
                    where <MathJax inline>{'\\(\\Psi(x,t)\\)'}</MathJax> is the string displacement at a given position, <MathJax inline>{'\\(\\nu\\)'}</MathJax> is the wave speed, and <MathJax inline>{'\\(\\mu\\)'}</MathJax> is damping.<br /><br />
    
                    We solve the wave equation numerically using <a href="https://en.wikipedia.org/wiki/Verlet_integration" target="_blank" rel="noopener noreferrer">Verlet integration</a> with spatial discretization and the Dirichlet boundary conditions
                    <MathJax>{`\\(
                        \\Psi(0, t) = H, \\Psi(L, t) = 0
                    \\)`}</MathJax>
                    where <MathJax inline>{'\\(H\\)'}</MathJax> is the height of the string on the left side and <MathJax inline>{'\\(L\\)'}</MathJax> is its length.
                </p>},
                {title: "How do I use this?", content: <p>
                    Click and drag the block on the left hand side of the screen to move the string up and down. The program initializes with a Gaussian wave packet. Use the sliders to change the constants. Use the toggle to change the color mode. Use the <span className="material-icons small">play_arrow</span>/<span className="material-icons small">pause</span> button to play or pause the demo, and the <span className="material-icons small">replay</span> button to reset.
                </p>}
            ]} />
            <hr />

            <h3>Parameters</h3>
            <Slider min="0.1" max="2" step="1e-3" label={<MathJax>{'\\(\\nu\\)'}</MathJax>}
                value={params.current.speed} onChange={(val) => {
                    params.current.speed = val;
            }} />
            <Slider min="0" max="0.5" step="1e-3" label={<MathJax>{'\\(\\mu\\)'}</MathJax>} 
                value={params.current.damping} onChange={(val) => {
                    params.current.damping = val;
            }}/>

            <Toggle label="Color by height" isToggled={doColors.current} 
                onChange={(toggled) => {
                    doColors.current = toggled;
            }} />

            <ButtonGroup>
                <button onClick={handlePause}>
                    <span className="material-icons" ref={iconRef}>pause</span>
                </button>
                <button onClick={resetString}>
                    <span className="material-icons">replay</span>
                </button>
            </ButtonGroup>
        </CanvasDemo>
    </>);
}

export default StringWavesDemo;