/**
 * This is the double-slit experiment demo.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */
import React from 'react';
import { useRef, useCallback } from 'react';
import { MathJax } from 'better-react-mathjax';
import { WebGLRenderer, Scene, OrthographicCamera, Vector2,
         ShaderMaterial, PlaneGeometry, GLSL3, Mesh, 
         WebGLRenderTarget, LinearFilter, FloatType } from 'three';

import Accordion from '../../components/accordion/Accordion';
import Slider from '../../components/slider/Slider';
    
import { ButtonGroup } from '../../components/groups/groups';
import { CanvasDemo } from '../../components/demos/demos';
import { shaderSources } from './shader_sources';

// Constants
const dt = 1e-2;
const nSteps = 4;

// Shaders
const mainShader = shaderSources.common + shaderSources.display;
const backbufferShader = shaderSources.common + shaderSources.backbuffer;

function DoubleSlitDemo() {
    // Canvas and renderer stuff for ThreeJS
    const canvasRef = useRef(null);
    const renderer = useRef(null);
    const camera = useRef(null);

    // Scale info
    const sclInfo = useRef(null);
    const isMobile = useRef(false);

    // Animation stuff
    const timeVal = useRef(0);
    const frameRef = useRef(null);
    const iconRef = useRef(null);
    const isPlaying = useRef(true);

    // Front and backbuffer scenes
    const backbufferRead = useRef(null);
    const backbufferWrite = useRef(null);
    const sceneFront = useRef(null);
    const sceneBack = useRef(null);

    // Parameters
    const params = useRef({
        dissipation: 4e-3,
        frequency: 10,
        holeY: 0.25,
        holeSize: 0.05});

    // Shader uniforms
    const uniforms = useRef({
        res: {value: new Vector2(0, 0)},
        scale: {value: 0},
        heightField: {value: null},
        time: {value: 0}
    });

    /*
    Updating parameters and uniforms.
    */

    const setUniform = useCallback((name, value) => {
        // Sets a uniform's value
        uniforms.current[name].value = value;
    }, []);

    const resetBuffer = useCallback(() => {
        // Clears the backbuffer's textures
        setUniform("heightField", null);
    }, [setUniform]);

    const setParameter = useCallback((name, value) => {
        // Sets the value of a given parameter
        setUniform(name, value);
        params.current[name] = value;
        resetBuffer();
    }, [setUniform, resetBuffer]);

    /*
    Animation and rendering.
    */

    const updateBackbuffer = useCallback(() => {
        // Update backbuffer
        renderer.current.setRenderTarget(backbufferWrite.current);
        renderer.current.clear();
        renderer.current.render(sceneBack.current, camera.current);

        // Swap buffers and set texture as uniform
        let temp = backbufferRead.current;
        backbufferRead.current = backbufferWrite.current;
        backbufferWrite.current = temp;

        setUniform("heightField", backbufferRead.current.texture);
    }, [setUniform]);

    const render = useCallback(() => {
        // Render scene
        renderer.current.setRenderTarget(null);
        renderer.current.render(sceneFront.current, camera.current);

        // Update backbuffer
        if (!isPlaying.current) return;
        for (let i = 0; i < nSteps; i ++) {
            updateBackbuffer();
        }

        // Update time
        timeVal.current += dt;
        setUniform("time", timeVal.current); 
    }, [updateBackbuffer, setUniform]);

    /*
    Animation stuff.
    */

    const mainLoop = useCallback(() => {
        // The main animation loop
        render();
        frameRef.current = requestAnimationFrame(mainLoop);
    }, [render]);

    const startLoop = useCallback(() => {
        // Starts the main animation loop
        frameRef.current = requestAnimationFrame(mainLoop);
    }, [mainLoop]);

    const stopLoop = useCallback(() => {
        // Cancels the animation frame
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
    Handling resizing.
    */

    const setScale = useCallback(() => {
        // Sets the renderer's size and scale
        let {width, height} = sclInfo.current;
        let scale = Math.min(width, height);

        // Set uniforms
        setUniform("scale", scale);
        setUniform("res", new Vector2(width, height));

        // Set buffer sizes
        if (renderer.current) {
            renderer.current.setSize(width, height);
            backbufferRead.current.setSize(width, height);
            backbufferWrite.current.setSize(width, height);
        }
    }, [setUniform]);

    const handleResize = useCallback((scl) => {
        // Handle devices that are too small
        if (scl.isMobile) {
            stopLoop();
        } else if (isMobile.current) {
            startLoop();
        }
        isMobile.current = scl.isMobile;

        // Set scale values
        sclInfo.current = scl;
        setScale();
    }, [startLoop, stopLoop, setScale]);

    /*
    Initialization.
    */

    const makeScenes = useCallback(() => {
        sceneFront.current = new Scene();
        sceneBack.current = new Scene();

        // Build the scene for the main shader
        let pln = new PlaneGeometry(2, 2);
        let mat = new ShaderMaterial({
            fragmentShader: mainShader,
            uniforms: uniforms.current,
            glslVersion: GLSL3});
        sceneFront.current.add(new Mesh(pln, mat));

        // Build the scene for the backbuffer
        mat = new ShaderMaterial({
            fragmentShader: backbufferShader,
            uniforms: uniforms.current,
            glslVersion: GLSL3});
        sceneBack.current.add(new Mesh(pln, mat));
    }, []);

    const prepareThree = useCallback(() => {
        // Initialize ThreeJS renderer and camera
        renderer.current = new WebGLRenderer({
            canvas: canvasRef.current,
            preserveDrawingBuffer: true
        });
        camera.current = new OrthographicCamera(-1, 1, 1, -1, -1, 1);

        // Initialize parameters as uniforms
        for (let [name, value] of Object.entries(params.current)) {
            uniforms.current[name] = {value};
        }

        // Create the backbuffer and prepare the scenes
        let scl = sclInfo.current;
        backbufferWrite.current = new WebGLRenderTarget(scl.width, scl.height, {
            minFilter: LinearFilter,
            magFilter: LinearFilter,
            type: FloatType,
            stencilBuffer: false});
        backbufferRead.current = backbufferWrite.current.clone();
        makeScenes();
    }, [makeScenes]);

    const initialize = useCallback(() => {
        prepareThree();

        // Start and set scale if not on mobile
        if (!isMobile.current) {
            setScale();
            startLoop();
        }
        return stopLoop;
    }, [prepareThree, setScale, startLoop, stopLoop]);

    return (<>
        <title>Double-slit experiment | Zenzicubic</title>
        <CanvasDemo title="Double-slit experiment" canvasRef={canvasRef} onInitialize={initialize} 
            onResize={handleResize}>
            <p>This demo allows you to experiment with the interference patterns created by the <a href="https://en.wikipedia.org/wiki/Double-slit_experiment" target="_blank" rel="noopener noreferrer">double-slit experiment</a>.</p>

            <Accordion title="What is this?">
                In the double-slit experiment, light illuminates on a plate with two parallel slits, with a screen placed behind it. One might expect the pattern of light that results to be two solid bands, but the pattern that is observed is a complicated series of alternating bright and dark bands. This is due to the fact that light behaves as a wave, and this experiment was pivotal in establishing the wave-particle duality of light. Electrons can also exhibit this behavior.<br /><br />

                This is a 2D model of this apparatus. The movement of light is simulated using a damped version of the classical <a href="https://en.wikipedia.org/wiki/Wave_equation" target="_blank" rel="noopener noreferrer">wave equation</a>:<br />
                <MathJax>{`\\(\\begin{align*} 
                    \\frac{\\partial^2 \\Psi}{\\partial t^2} = 
                    \\nabla^2 \\Psi - 
                    \\mu \\frac{\\partial \\Psi}{\\partial t}
                \\end{align*}\\)`}</MathJax>
                where the constant <MathJax inline>{'\\(\\mu\\)'}</MathJax> represents dissipation. The function <MathJax inline>{'\\(\\Psi(\\mathbf{x}, t)\\)'}</MathJax> represents light intensity at a particular position and time.<br /><br />

                In reality, light obeys a slightly different form of this equation, but it is a fairly good approximation. The equation is numerically integrated using Verlet integration here with Dirichlet boundary conditions.
            </Accordion>
            <Accordion title="How do I use this?">
                Use the sliders to change the damping of the wave equation, the frequency of the emitter, and the width and offset of the slits in the barrier. Use the <span className="material-icons small">play_arrow</span>/<span className="material-icons small">pause</span> button to play or pause the demo, and the <span className="material-icons small">replay</span> button to reset.
            </Accordion>
            <hr />

            <h3>Wave parameters</h3>
            <Slider min="1e-3" max="8e-3" step="1e-4" value={params.current.dissipation}
                label={<MathJax inline>{'\\(\\mu\\)'}</MathJax>} 
                onChange={(val) => setParameter("dissipation", val)}/>

            <Slider min="3" max="15" step="1e-2" label="Frequency" 
                value={params.current.frequency}
                onChange={(val) => setParameter("frequency", val)}/>

            <h3>Barrier parameters</h3>
            <Slider min="0.15" max="0.75" step="1e-2" label="Hole offset"
                value={params.current.holeY}
                onChange={(val) => setParameter("holeY", val)}/>

            <Slider min="0.01" max="0.1" step="1e-3" label="Hole size"
                value={params.current.holeSize}
                onChange={(val) => setParameter("holeSize", val)}/>

            <ButtonGroup>
                <button onClick={handlePause}>
                    <span className="material-icons" ref={iconRef}>pause</span>
                </button>
                <button onClick={resetBuffer}>
                    <span className="material-icons">replay</span>
                </button>
            </ButtonGroup>
        </CanvasDemo>
    </>);
}

export default DoubleSlitDemo;