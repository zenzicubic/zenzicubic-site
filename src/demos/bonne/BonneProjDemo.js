/**
 * This is the Bonne projection demo. The image of the Earth comes
 * from NASA's Visible Earth project.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

import React from 'react';
import { MathJax } from 'better-react-mathjax';
import { useRef, useCallback } from 'react';
import { WebGLRenderer, Scene, OrthographicCamera, Vector2,
    ShaderMaterial, PlaneGeometry, GLSL3, Mesh, TextureLoader } from 'three';

import { getRotMatY, getRotMatZ } from '../../threedengine/threedmath';
import { CanvasDemo } from '../../components/demos/demos';
import Slider from '../../components/slider/Slider';
import worldMap from './earthmap.jpg';

function BonneProjDemo() {
    // Canvas and ThreeJS components
    const canvasRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    
    // Image and fragment shader
    const shaderRef = useRef(null);
    const mapRef = useRef(null);

    // Scaling
    const isMobile = useRef(false);
    const sclInfo = useRef(null);

    // Uniforms and parameters
    const isDragging = useRef(false);
    const phi1 = useRef(45);
    const uniforms = useRef({
        rot: {value: [1, 0, 0, 0, 1, 0, 0, 0, 1]},
        size: {value: new Vector2(0, 0)},
        phi1: {value: Math.PI * 0.25},
        cotPhi1: {value: 1},
        mapTex: {value: null},
        scale: {value: 0}
    });

    // Animation frame
    const frameRef = useRef(null);

    /*
    Main animation loop.
    */

    const mainLoop = useCallback(() => {
        // The main loop
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        
        frameRef.current = requestAnimationFrame(mainLoop);
    }, []);

    const startLoop = useCallback(() => {
        // Starts the animation loop
        frameRef.current = requestAnimationFrame(mainLoop);
    }, [mainLoop]);

    const stopLoop = useCallback(() => {
        // Stops the animation loop
        cancelAnimationFrame(frameRef.current);
    }, []);

    /*
    Handling scaling of the UI.
    */

    const handleResize = useCallback((scl) => {
        // Handle mobile
        if (scl.isMobile) {
            stopLoop();
        } else if (isMobile.current) {
            startLoop();
        }
        isMobile.current = scl.isMobile;

        // Set size and scale of display
        let {width, height} = scl;
        let scale = Math.min(width, height);
        sclInfo.current = {...scl, scale};
        
        uniforms.current.scale.value = scale;
        uniforms.current.size.value.set(width, height);
        if (rendererRef.current) {
            rendererRef.current.setSize(width, height);
        }
    }, [startLoop, stopLoop]);

    /*
    Handling parameter updates and dragging.
    */

    const updateParams = useCallback(() => {
        // Sets standard parallel
        let phi = phi1.current * (Math.PI / 180);
        let cotPhi = 1 / Math.tan(phi);

        uniforms.current.phi1.value = phi;
        uniforms.current.cotPhi1.value = cotPhi;
    }, []);

    const handleDrag = useCallback((mouseX, mouseY) => {
        if (!isDragging.current) return;

        // Remap coords
        let scl = sclInfo.current;
        let rx = Math.PI * (mouseX - 0.5 * scl.width) / scl.scale;
        let ry = Math.PI * (mouseY - 0.5 * scl.height) / scl.scale;

        // Compute matrices
        let mat = getRotMatZ(-rx);
        mat = mat.mul(getRotMatY(ry));
        uniforms.current.rot.value = mat.vals.flat();
    }, []);
    
    /*
    Initializing.
    */

    const prepareRenderer = useCallback(() => {
        // Initialize Three components
        rendererRef.current = new WebGLRenderer({
            canvas: canvasRef.current,
            preserveDrawingBuffer: true
        });
        sceneRef.current = new Scene();
        cameraRef.current = new OrthographicCamera(-1, 1, 1, -1, -1, 1);

        // Create the mesh and material
        let pln = new PlaneGeometry(2, 2);
        let mat = new ShaderMaterial({
            fragmentShader: shaderRef.current,
            uniforms: uniforms.current,
            glslVersion: GLSL3
        });
        sceneRef.current.add(new Mesh(pln, mat));

        // Set uniform values
        uniforms.current.mapTex.value = mapRef.current;

        // Start and set scale if not on mobile
        if (isMobile.current) return;
    
        let scl = sclInfo.current;
        rendererRef.current.setSize(scl.width, scl.height);
        startLoop();
    }, [startLoop]);

    const initialize = useCallback(() => {
        // Load shader and world map
        let loader = new TextureLoader();
        let promise1 = fetch(require("./bonne-projection.glsl"))
            .then((res) => res.text())
            .then((res) => { shaderRef.current = res; });
        let promise2 = new Promise(resolve => {
            mapRef.current = loader.load(worldMap, resolve);
        });

        // Create renderer on load
        Promise.all([promise1, promise2]).then(prepareRenderer);

        return stopLoop;
    }, [prepareRenderer, stopLoop]);

    return (<>
        <title>Bonne projection | Zenzicubic</title>
        <CanvasDemo title="Bonne projection" canvasRef={canvasRef} onInitialize={initialize} 
            onResize={handleResize} onInteractionStart={() => isDragging.current = true }
            onInteractionMove={handleDrag} onInteractionEnd={() => isDragging.current = false }>
                <p>
                    This is a visualization of the <a href="https://en.wikipedia.org/wiki/Bonne_projection" target="_blank" rel="noopener noreferrer">Bonne projection</a>, a map projection that maps the earth&apos;s surface to a heart-shaped region. I think it looks quite nice, and I was inspired by  a shader made by Matthew Arcus. Drag to rotate the Earth, and use the slider to change the standard parallel <MathJax inline>{'\\(\\varphi_1\\)'}</MathJax>. The <a href="https://visibleearth.nasa.gov/images/57752/blue-marble-land-surface-shallow-water-and-shaded-topography" target="_blank" rel="noopener noreferrer">map image</a> used is from NASA&apos;s Visible Earth project.
                </p>
                <hr />
                <Slider min="0" max="90" step="0.1" value={phi1.current}
                    label={<MathJax inline>{'\\(\\varphi_1\\)'}</MathJax>} 
                    formatFn={(x) => x + "\u00B0"} onChange={(val) => {
                        phi1.current = val;
                        updateParams();
                    }}/>
        </CanvasDemo> 
    </>);
}

export default BonneProjDemo;