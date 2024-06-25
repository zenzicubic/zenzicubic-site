/**
 * This is the spring-mass system demo.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */
import React from 'react';
import { useRef, useCallback } from 'react';
import { MathJax } from 'better-react-mathjax';

import Slider from '../../components/slider/Slider';
import Accordion from '../../components/accordion/Accordion';

import { CanvasDemo } from '../../components/demos/demos';
import { ButtonGroup, TabGroup } from '../../components/groups/groups';
import { vec2, sqr, clamp } from '../../math';

// Integrator constants
const dt = 0.05;

// Drawing constants
const initialState = vec2(2, 0);
const pathThickness = 2;
const pathCol = "#f2c14e";
const textY = 14;
const ptRad = 5;

const gridWidth = 0.25;
const sclFac = 0.15;

const formatDecimal = (x) => x.toFixed(2);

// Spring stuff
const restLen = 2;
const maxSpringLen = 3;
const minSpringLen = -1;

const nSpringSegs = 14;
const springOffsetX = 20;
const springOffsetTop = 50;

const massSize = 40;
const massDiam = massSize * 0.5;

// Path and grid info
const epsilon = 1e-3;
const pathLen = 800;
const nGridLines = 40;

// The actual demo
function SpringMassDemo() {
    // Canvas and context
    const canvasRef = useRef(null);
    const ctx = useRef(null);

    // Animation frame
    const isMobile = useRef(false);
    const sclInfo = useRef(null);

    // Animation stuff
    const frameRef = useRef(null);
    const iconRef = useRef(null);
    const isPlaying = useRef(true);

    // Drag handling
    const isDragging = useRef(false);
    const wasPlaying = useRef(false);
    const startDiff = useRef(null);
    const startDisp = useRef(null);

    // Integrator state and path
    const elapsedTime = useRef(0);
    const state = useRef(null);
    const dispPath = useRef([]);
    const phasePath = useRef([]);

    // Display mode
    const viewMode = useRef(0);

    // Parameters
    const params = useRef({m: 2, invM: 0.5, r: 0.3, k: 2});

    /*
    Performing numerical integration and resetting.
    */

    const resetTrace = useCallback(() => {
        // Resets the path and velocity
        dispPath.current = [];
        phasePath.current = [];

        state.current.y = 0;
        elapsedTime.current = 0;
    }, []);
    
    const resetDemo = useCallback(() => {
        // Resets the entire demo
        state.current = initialState;
        resetTrace();
    }, [resetTrace]);

    const func = useCallback((st) => {
        // The differential equation to be integrated
        let {invM, r, k} = params.current;
        return vec2(st.y, -invM * (r * st.y + k * st.x));
    }, []);

    const integrate = useCallback(() => {
        // Store the state
        let st = state.current;

        // Performs a single step of RK4 integration
        let k1 = func(st).scale(dt);
        let k2 = func(st.add(k1.scale(0.5))).scale(dt);
        let k3 = func(st.add(k2.scale(0.5))).scale(dt);
        let k4 = func(st.add(k3)).scale(dt);
        let diff = k1.add(k4).scale(0.5).add(k2.add(k3)).scale(0.3333);
        
        let newSt = st.add(diff);
        state.current = newSt;
        elapsedTime.current += dt;

        // Add point to paths
        if (newSt.normSq() > epsilon) {
            phasePath.current.push(newSt);
        }
        dispPath.current.push(newSt.x);
        dispPath.current = dispPath.current.slice(-pathLen);
    }, [func]);

    /*
    Drawing the demo.
    */

    const drawText = useCallback(() => {
        let {m, k} = params.current;
        let st = state.current;
        
        // Compute potential/kinetic energy
        let ePot = 0.5 * k * sqr(st.x);
        let eKin = 0.5 * m * sqr(st.y);

        // Draw text to canvas
        ctx.current.resetTransform();
        ctx.current.fillStyle = "white";
        ctx.current.font = "1em 'Source Code Pro'";

        ctx.current.fillText("Elapsed time: " + formatDecimal(elapsedTime.current), 0, textY);
        ctx.current.fillText("Potential energy: " + formatDecimal(ePot), 0, 2 * textY);
        ctx.current.fillText("Kinetic energy: " + formatDecimal(eKin), 0, 3 * textY);
    }, []);

    const drawGrid = useCallback(() => {
        // Draws the grid
        let scl = sclInfo.current;
        ctx.current.lineWidth = gridWidth;
        ctx.current.strokeStyle = "white";

        // Vertical lines
        for (let x = 0; x <= scl.width; x += scl.gridStep) {
            ctx.current.beginPath();
            ctx.current.moveTo(x, 0);
            ctx.current.lineTo(x, scl.height);
            ctx.current.stroke();
        }

        // Horizontal lines
        for (let y = 0; y <= scl.height; y += scl.gridStep) {
            ctx.current.beginPath();
            ctx.current.moveTo(0, y);
            ctx.current.lineTo(scl.width, y);
            ctx.current.stroke();
        }
    }, []);

    const drawPhasePlot = useCallback(() => {
        /*
        Draws the phase space plot of the system.
        */
        let scl = sclInfo.current;
        drawGrid();

        // Transform the canvas
        ctx.current.fillStyle = pathCol;
        ctx.current.translate(scl.hW, scl.hH);
        ctx.current.scale(1, -1);
        
        // Draw the path
        ctx.current.lineWidth = pathThickness;
        ctx.current.strokeStyle = pathCol;
        ctx.current.beginPath();
        for (let pt of phasePath.current) {
            ctx.current.lineTo(pt.x * scl.graphScl, pt.y * scl.graphScl);
        }
        ctx.current.stroke();

        // Draw the point on the canvas
        let st = state.current;
        ctx.current.beginPath();
        ctx.current.arc(st.x * scl.graphScl, st.y * scl.graphScl, ptRad, 0, 2 * Math.PI);
        ctx.current.fill();
    }, [drawGrid]);

    const drawTimeSeriesPlot = useCallback(() => {
        /*
        Draws the time-series plot of the system.
        */
        let scl = sclInfo.current;
        drawGrid();

        // Transform canvas
        ctx.current.translate(0, scl.hH);
        ctx.current.scale(1, -1);

        // Draw the midline
        ctx.current.lineWidth = pathThickness;
        ctx.current.beginPath();
        ctx.current.moveTo(0, 0);
        ctx.current.lineTo(scl.width, 0);
        ctx.current.stroke();

        // Draw the curve
        let x = 0;
        ctx.current.strokeStyle = pathCol;
        ctx.current.beginPath();
        for (let y of dispPath.current) {
            ctx.current.lineTo(x, y * scl.graphScl);
            x += scl.delta;
        }
        ctx.current.stroke();
    }, [drawGrid]);

    const drawSpring = useCallback(() => {
        /*
        Draws the spring and mass.
        */
        let scl = sclInfo.current;

        // Transform canvas and set line properties
        ctx.current.translate(scl.hW, 0);
        ctx.current.lineWidth = pathThickness;
        ctx.current.strokeStyle = "white";

        // Compute some constants
        let springLen = (restLen + state.current.x) * scl.graphScl;
        let delta = springLen / (nSpringSegs + 4);

        let x = springOffsetX;
        let y = springOffsetTop + delta;
        
        // Draw start of spring
        ctx.current.beginPath();
        ctx.current.moveTo(0, springOffsetTop);
        ctx.current.lineTo(0, y);

        // Draw zigzag part
        y += delta;
        for (let i = 0; i < nSpringSegs; i ++) {
            ctx.current.lineTo(x, y);
            x *= -1;
            y += delta;
        }

        // Draw end of spring
        ctx.current.lineTo(0, y);
        y += delta;
        ctx.current.lineTo(0, y);
        ctx.current.stroke();

        // Draw the mass
        ctx.current.fillStyle = "white";
        ctx.current.fillRect(-massDiam, y, massSize, massSize);
    }, []);

    /*
    Animation stuff.
    */

    const mainLoop = useCallback(() => {
        // Perform integration
        if (isPlaying.current)
            integrate();

        // Draw everything
        ctx.current.reset();
        if (viewMode.current === 0) {
            drawSpring();
        } else if (viewMode.current === 1) {
            drawPhasePlot();
        } else {
            drawTimeSeriesPlot();
        }
        drawText();

        frameRef.current = requestAnimationFrame(mainLoop);
    }, [integrate, drawText, drawSpring, drawPhasePlot, drawTimeSeriesPlot]);

    const startLoop = useCallback(() => {
        // Starts the animation frame
        frameRef.current = requestAnimationFrame(mainLoop);
    }, [mainLoop]);

    const stopLoop = useCallback(() => {
        // Stops the animation frame
        cancelAnimationFrame(frameRef.current);
    }, []);

    const handlePause = useCallback(() => {
        // Handle playing/pausing the demo
        if (isPlaying.current) {
            iconRef.current.innerHTML = "play_arrow";
        } else {
            iconRef.current.innerHTML = "pause";
        }
        isPlaying.current = !isPlaying.current;
    }, []);

    /*
    Handling dragging.
    */

    const mapBlockY = useCallback((y) => {
        // Maps mouse Y to displacement
        return (y - springOffsetTop) / sclInfo.current.graphScl - restLen;
    }, [])

    const startDrag = useCallback((posX, posY) => {
        let scl = sclInfo.current;

        // Check if we are within the block
        let disp = state.current.x;
        let blockY = springOffsetTop + (restLen + disp) * scl.graphScl;
        let inBlock = (Math.abs(posY - blockY) < massDiam && Math.abs(posX - scl.hW) < massDiam);

        if (viewMode.current === 0 && inBlock) {
            // Store initial block position
            startDiff.current = mapBlockY(posY);
            startDisp.current = disp;

            // Store play state
            wasPlaying.current = isPlaying.current;
            isDragging.current = true;
            isPlaying.current = false;
        }
    }, [mapBlockY]);
    
    const handleDrag = useCallback((posX, posY) => {
        if (isDragging.current) {
            // Compute displacement
            let disp = mapBlockY(posY);
            let delta = disp - startDiff.current;
            let newDisp = startDisp.current + delta;

            // Set state
            state.current.x = clamp(newDisp, minSpringLen, maxSpringLen);
            resetTrace();
        }
    }, [mapBlockY, resetTrace]);

    const handleDragEnd = useCallback(() => {
        // Restart the animation
        isDragging.current = false;
        if (wasPlaying.current) {
            isPlaying.current = true;
        }
    }, []);

    /*
    Handling resizing of the demo.
    */

    const handleResize = useCallback((scl) => {
        // Handle screens that are too small
        if (scl.isMobile) {
            stopLoop(); 
        } else if (isMobile.current) {
            startLoop();
        }
        isMobile.current = scl.isMobile;

        // Set scale info
        let {width, height} = scl;
        let scale = Math.min(width, height);

        let graphScl = sclFac * scale;
        let gridStep = scale / nGridLines;
        let delta = width / pathLen;
        sclInfo.current = {...scl, graphScl, gridStep, delta};
    }, [startLoop, stopLoop]);

    /*
    Initializing the demo.
    */

    const initialize = useCallback(() => {
        // Create the context
        ctx.current = canvasRef.current.getContext("2d");
        resetDemo();

        // Start/stop the animation frame
        if (!isMobile.current) {
            startLoop();
        }
        return stopLoop;
    }, [resetDemo, startLoop, stopLoop]);

    return (<>
        <title>Spring-mass system | Zenzicubic</title>
        <CanvasDemo title="Spring-mass system" canvasRef={canvasRef} onInitialize={initialize}
            onResize={handleResize} onInteractionStart={startDrag} onInteractionMove={handleDrag}
            onInteractionEnd={handleDragEnd}>
            <p>This is an interactive simulation of a simple damped spring-mass system, which you may know about from your physics classes.</p>

            <Accordion title="What is this?">
                A spring-mass system, more technically a type of <a href="https://en.wikipedia.org/wiki/Harmonic_oscillator" target="_blank" rel="noopener noreferrer">damped harmonic oscillator</a>, is one of the simplest physical systems. It consists of a mass attached to a spring. The displacement of the spring from its rest length is described by the linear differential equation:

                <MathJax>{`\\( \\begin{align*} 
                    m\\ddot{x} + \\mu \\dot{x} + kx = 0
                \\end{align*} \\)`}</MathJax>

                <MathJax inline>{'\\(x\\)'}</MathJax> represents the spring&apos;s displacement. As for the coefficients, <MathJax inline>{'\\(m\\)'}</MathJax> is the magnitude of the mass, <MathJax inline>{'\\(\\mu\\)'}</MathJax> is the damping coefficient which represents air resistance and the like, and <MathJax inline>{'\\(k\\)'}</MathJax> is the spring constant (see <a href="https://en.wikipedia.org/wiki/Hooke%27s_law" target="_blank" rel="noopener noreferrer">Hooke&apos;s law</a>). Though these equations may be solved analytically, the equations are solved numerically using Runge-Kutta 4 (RK4) integration.
            </Accordion>

            <Accordion title="How do I use this?">
                There are three different views: a visualization of the spring and mass, a <MathJax inline>{'\\(x-\\dot{x}\\)'}</MathJax> phase plane plot, and a time-series plot. Use the menu at the bottom to switch between them. You can move the mass (the white square) by clicking and dragging it when in the system view.<br /><br />
                
                The physical parameters of the system (mass <MathJax inline>{'\\(m\\)'}</MathJax>, damping <MathJax inline>{'\\(\\mu\\)'}</MathJax> and spring constant <MathJax inline>{'\\(k\\)'}</MathJax>) may be modified using the sliders. The elapsed time, potential, and kinetic energy are displayed in the upper left-hand corner. Use the <span className="material-icons small">play_arrow</span>/<span className="material-icons small">pause</span> button to play or pause the animation. To reset the simulation, press the <span className="material-icons small">replay</span> button. Any time the spring is moved the simulation is automatically reset.
            </Accordion>
            <hr />

            <Slider label={<MathJax inline>{'\\(m\\)'}</MathJax>} min="0.1" 
                max="2" value={params.current.m} step="1e-3" onChange={(val) => {
                    params.current.m = val;
                    params.current.invM = 1 / val;
            }} />
            <Slider label={<MathJax inline>{'\\(\\mu\\)'}</MathJax>} min="0.05" 
                max="2" value={params.current.r} step="1e-3" onChange={(val) => {
                    params.current.r = val;
            }} />
            <Slider label={<MathJax inline>{'\\(k\\)'}</MathJax>} min="0.5" 
                max="2" value={params.current.k} step="1e-3" onChange={(val) => {
                    params.current.k = val;
            }} />

            <ButtonGroup>
                <button onClick={handlePause}>
                    <span className="material-icons" ref={iconRef}>pause</span>
                </button>
                <button onClick={resetDemo}>
                    <span className="material-icons">replay</span>
                </button>
            </ButtonGroup>
        </CanvasDemo>
        <TabGroup title="View:" btnNames={["System", "Phase plane", "Time-series"]} 
            onTabChange={(mode) => viewMode.current = mode }/>
    </>);
}

export default SpringMassDemo;