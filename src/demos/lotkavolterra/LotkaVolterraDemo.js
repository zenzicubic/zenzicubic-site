/**
 * This is the Lotka-Volterra demo.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */
import React from 'react';
import { useRef, useCallback } from 'react';
import { MathJax } from 'better-react-mathjax';

import Slider from '../../components/slider/Slider';
import Accordion from '../../components/accordion/Accordion';
import { CanvasDemo } from '../../components/demos/demos';
import { TabGroup, ButtonGroup } from '../../components/groups/groups';
import { vec2 } from '../../math';

// Integration/animation constants
const dt = 0.0075;
const nSteps = 5;

// Geometry constants
const gridWidth = 0.25;
const pathThickness = 2;
const textY = 14;
const ptRad = 5;

const arrowLen = 0.2;
const sclFac = 0.1;

// Path and grid info
const pathLen = 4000;
const numGridLines = 40;

// The actual demo
function LotkaVolterraDemo() {
    // Canvas and context
    const canvasRef = useRef(null);
    const ctx = useRef(null);
    const viewMode = useRef(0);

    // Scale info
    const isMobile = useRef(false);
    const sclInfo = useRef(null);

    // Animation stuff
    const frameRef = useRef(null);
    const iconRef = useRef(null);
    const isPlaying = useRef(true);

    // Integrator state and path
    const elapsedTime = useRef(0);
    const state = useRef(vec2(2, 2));
    const path = useRef([]);

    // Initial conditions and parameters
    const initialCondition = useRef(vec2(2, 2));
    const params = useRef({a: 0.66, b: 1.33, c: 1, d: 1});
    
    /*
    Performing numerical integration and resetting.
    */

    const resetDemo = useCallback(() => {
        // Resets the path and state
        path.current = [];
        elapsedTime.current = 0;
        state.current = initialCondition.current;
    }, []);

    const func = useCallback((st) => {
        // The differential equation to integrate
        let {a, b, c, d} = params.current;
        return vec2(
            a * st.x - b * st.x * st.y,
            c * st.x * st.y - d * st.y);
    }, []);

    const step = useCallback(() => {
        let st = state.current;

        // Performs a single step of RK4 integration
        let k1 = func(st).scale(dt);
        let k2 = func(st.add(k1.scale(0.5))).scale(dt);
        let k3 = func(st.add(k2.scale(0.5))).scale(dt);
        let k4 = func(st.add(k3)).scale(dt);
        let diff = k1.add(k4).scale(0.5).add(k2.add(k3)).scale(0.3333);
        
        state.current = st.add(diff);
        elapsedTime.current += dt;
        
        // Add point to path
        path.current.push(state.current);
    }, [func]);

    const doSteps = useCallback(() => {
        // Do a bunch of integration steps
        for (let i = 0; i < nSteps; i ++) {
            step();
        }
        path.current = path.current.slice(-pathLen);
    }, [step]);

    /*
    Draw the scene.
    */

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

    const drawTimeSeriesPlot = useCallback(() => {
        let scl = sclInfo.current;
        drawGrid();
        ctx.current.lineWidth = pathThickness;

        // Draw the prey curve
        ctx.current.strokeStyle = "#FC6255";
        ctx.current.beginPath();
        let x = 0;
        for (let pt of path.current) {
            ctx.current.lineTo(x, pt.x * scl.pathScl);
            x += scl.delta;
        }
        ctx.current.stroke();

        // Draw the prey curve
        ctx.current.strokeStyle = "#58C4DD";
        ctx.current.beginPath();
        x = 0;
        for (let pt of path.current) {
            ctx.current.lineTo(x, pt.y * scl.pathScl);
            x += scl.delta;
        }
        ctx.current.stroke();
    }, [drawGrid]);

    const drawSlopeField = useCallback(() => {
        let scl = sclInfo.current;
        ctx.current.lineWidth = gridWidth;
        ctx.current.strokeStyle = "white";

        // Draws the slope field
        let v, dv;
        for (let x = 0; x <= scl.width; x += scl.gridStep) {
            for (let y = 0; y <= scl.height; y += scl.gridStep) {
                // Get the vector
                v = vec2(x, y).div(scl.pathScl);
                dv = func(v).normalize().scale(arrowLen);
                
                // Draw the line
                ctx.current.beginPath();
                ctx.current.moveTo(x, y);
                ctx.current.lineTo(x + dv.x * scl.pathScl, y + dv.y * scl.pathScl);
                ctx.current.stroke();
            }
        }
    }, [func]);

    const drawPhasePlot = useCallback(() => {
        let scl = sclInfo.current.pathScl;
        drawSlopeField();

        // Draw the phase curve
        ctx.current.strokeStyle = "#83C167";
        ctx.current.lineWidth = pathThickness;

        ctx.current.beginPath();
        for (let pt of path.current) {
            ctx.current.lineTo(pt.x * scl, pt.y * scl);
        }
        ctx.current.stroke();

        // Draw the point
        let lastPt = path.current[path.current.length - 1];

        ctx.current.fillStyle = "#83C167";
        ctx.current.beginPath();
        ctx.current.arc(lastPt.x * scl, lastPt.y * scl, ptRad, 0, 2 * Math.PI);
        ctx.current.fill();
    }, [drawSlopeField]);

    /*
    Animation loop.
    */

    const mainLoop = useCallback(() => {
        // Clear the canvas
        let scl = sclInfo.current;
        ctx.current.clearRect(0, 0, scl.width, scl.height);
        
        // Draw the elapsed time
        ctx.current.fillStyle = "white";
        ctx.current.font = "1em 'Source Code Pro'";

        ctx.current.resetTransform();
        ctx.current.fillText("Elapsed time: " + elapsedTime.current.toFixed(3), 0, textY);

        // Do steps and draw
        if (isPlaying.current) {    
            doSteps();
        }
        
        ctx.current.translate(0, sclInfo.current.height);
        ctx.current.scale(1, -1);
        if (viewMode.current === 0) {
            drawTimeSeriesPlot();
        } else {
            drawPhasePlot();
        }

        frameRef.current = requestAnimationFrame(mainLoop);
    }, [doSteps, drawTimeSeriesPlot, drawPhasePlot]);

    const startLoop = useCallback(() => {
        // Starts the main loop
        frameRef.current = requestAnimationFrame(mainLoop);
    }, [mainLoop]);

    const stopLoop = useCallback(() => {
        // Stops the main animation loop
        cancelAnimationFrame(frameRef.current);
    }, []);

    const handlePause = useCallback(() => {
        // Handles the play/pause button being clicked
        if (isPlaying.current) {
            iconRef.current.innerHTML = "play_arrow";
        } else {
            iconRef.current.innerHTML = "pause";
        }
        isPlaying.current = !isPlaying.current;
    }, []);

    /*
    Handles resizing of the demo.
    */

    const handleResize = useCallback((scl) => {
        // Handle devices that are too small
        if (scl.isMobile) {
            stopLoop();
        } else if (isMobile.current && isPlaying.current) {
            startLoop();
        }
        isMobile.current = scl.isMobile;

        // Set scale values
        let {width, height} = scl;
        let scale = Math.min(width, height);

        let pathScl = scale * sclFac;
        let delta = width / pathLen;
        let gridStep = scale / numGridLines;
        sclInfo.current = {...scl, pathScl, delta, gridStep};
    }, [startLoop, stopLoop]);

    /*
    Initialization.
    */

    const initialize = useCallback(() => {
        // Initialize context
        ctx.current = canvasRef.current.getContext("2d");
        resetDemo();

        // Start animation
        if (!isMobile.current) {
            startLoop();
        }
        return stopLoop;
    }, [resetDemo, startLoop, stopLoop]);

    return (<>
        <title>Lotka-Volterra model | Zenzicubic</title>
        <CanvasDemo title="Lotka-Volterra model" canvasRef={canvasRef} onInitialize={initialize} 
            onResize={handleResize}>
            <p>This is an interactive simulation of the <a href="https://en.wikipedia.org/wiki/Lotka-Volterra_equations" target="_blank" rel="noopener noreferrer">Lotka-Volterra model</a>, a mathematical model of animal population.</p>

            <Accordion sections={[
                {title: "What is this?", content: <p>
                    Speaking technically, the Lotka-Volterra model is a system of two coupled nonlinear first-order ODEs designed to describe the dynamics of a simple ecosystem with two species: predators (for example foxes) and prey (for example rabbits). They take the form:

                    <MathJax>{`\\( \\begin{align*} 
                        \\dot{x} &= \\alpha x - \\beta x y \\\\
                        \\dot{y} &= \\gamma x y - \\delta y
                    \\end{align*} \\)`}</MathJax>

                    In these equations, <MathJax inline>{'\\(x\\)'}</MathJax> represents the relative population of prey and <MathJax inline>{'\\(y\\)'}</MathJax> represents the relative population of predators.<br /><br />

                    As for the coefficients, <MathJax inline>{'\\(\\alpha\\)'}</MathJax> represents prey population growth rate, <MathJax inline>{'\\(\\beta\\)'}</MathJax> represents prey predation rate, <MathJax inline>{'\\(\\gamma\\)'}</MathJax> represents predator population growth relative to prey predation, and <MathJax inline>{'\\(\\delta\\)'}</MathJax> represents predator death rate. The equations are integrated using Runge-Kutta 4 (RK4) integration.
                                    </p>},
                {title: "How do I use this?", content: <p>
                    This program has two views of the system: a view in the <MathJax inline>{'\\(x - y\\)'}</MathJax> phase plane and a view of the time-series plots of the two variables. In the time-series plot, relative prey population is the red curve, and relative predator population is the blue curve.<br /><br />
                
                    Use the menu on the bottom right to switch between them. Use the sliders to adjust the initial conditions and coefficients (see above for their meaning). Elapsed time is in the upper left-hand corner. Press <span className="material-icons small">play_arrow</span>/<span className="material-icons small">pause</span> to play or pause the simulation, and <span className="material-icons small">replay</span> to reset the simulation.
                </p>}
            ]} />
            <hr />

            <h3>Relative initial populations</h3>

            <Slider label={<MathJax inline>{'\\(x(0)\\)'}</MathJax>} min="0.1" 
                max="3" value={initialCondition.current.x} step="1e-3" onChange={(val) => {
                    initialCondition.current.x = val;
                    resetDemo();
            }} />
            <Slider label={<MathJax inline>{'\\(y(0)\\)'}</MathJax>} min="0.1"
                max="3" value={initialCondition.current.y} step="1e-3" onChange={(val) => {
                    initialCondition.current.y = val;
                    resetDemo();
            }} />

            <h3>Coefficients</h3>

            <Slider label={<MathJax inline>{'\\(\\alpha\\)'}</MathJax>} min="0.4" 
                max="2" value={params.current.a} step="1e-3" onChange={(val) => {
                    params.current.a = val;
                    resetDemo();
            }} />
            <Slider label={<MathJax inline>{'\\(\\beta\\)'}</MathJax>} min="0.4" 
                max="2" value={params.current.b} step="1e-3" onChange={(val) => {
                    params.current.b = val;
                    resetDemo();
            }} />
            <Slider label={<MathJax inline>{'\\(\\gamma\\)'}</MathJax>} min="0.5" 
                max="2" value={params.current.c} step="1e-3" onChange={(val) => {
                    params.current.c = val;
                    resetDemo();
            }} />
            <Slider label={<MathJax inline>{'\\(\\delta\\)'}</MathJax>} min="0.5" 
                max="2" value={params.current.d} step="1e-3" onChange={(val) => {
                    params.current.d = val;
                    resetDemo();
            }} />

            <hr />

            <ButtonGroup>
                <button onClick={handlePause}>
                    <span className="material-icons" ref={iconRef}>pause</span>
                </button>
                <button onClick={resetDemo}>
                    <span className="material-icons">replay</span>
                </button>
            </ButtonGroup>
        </CanvasDemo>

        <TabGroup title="Plot:" btnNames={["Time-series", "Phase plane"]} 
            onTabChange={(tab) => viewMode.current = tab }/>
    </>);
}

export default LotkaVolterraDemo;