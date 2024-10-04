/**
 * This is the Clifford torus demo.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

import React from 'react';
import { useRef, useCallback } from 'react';
import { MathJax } from 'better-react-mathjax';

import { Vector3, WebGLRenderer, Scene, PerspectiveCamera, DirectionalLight, 
    AmbientLight, MeshPhysicalMaterial, Mesh, DoubleSide, TextureLoader, 
    EquirectangularReflectionMapping } from 'three';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import Toggle from '../../components/toggle/Toggle';
import Accordion from '../../components/accordion/Accordion';
import '../../components/buttons/button-menu.css';
import PressableIcon from '../../components/buttons/PressableIcon';
import { CanvasDemo } from '../../components/demos/demos';

// Constants

const one_over_rt2 = Math.sqrt(0.5);
const numSubdivisions = 100;

const lightColor = 0xffffff;
const speed = 2.5e-4;
const deltaAngle = 1e-2;

const NOT_ROTATING = 0;
const ROTATING_FORWARD = 1;
const ROTATING_BACKWARD = 2;

// The actual demo
function CliffordTorusDemo() {
    // Canvas and renderer
    const canvasRef = useRef(null);
    const renderer = useRef(null);
    const scene = useRef(null);

    // Camera and orbit controls
    const camera = useRef(null);
    const orbitCtrls = useRef(null);

    // Mesh and material
    const mat = useRef(null);
    const mesh = useRef(null);

    // Scale info
    const sclInfo = useRef(null);
    const isMobile = useRef(false);

    // Animation stuff
    const rotationDirection = useRef(NOT_ROTATING);
    const iconRef = useRef(null);
    const prevTime = useRef(0);
    const frameRef = useRef(null);

    // Parameters
    const doRotate = useRef(true);
    const doOrtho = useRef(false);
    const rotAngle = useRef(0);

    /*
    Updating geometry.
    */

    const updateGeometry = useCallback(() => {
        // Updates the scene geometry
        let geom = new ParametricGeometry((u, v, outputPt) => {
            u *= 2 * Math.PI;
            v *= 2 * Math.PI;

            // Get point on Clifford torus
            let x = Math.cos(u) * one_over_rt2;
            let y = Math.sin(u) * one_over_rt2;
            let z = Math.cos(v) * one_over_rt2;
            let w = Math.sin(v) * one_over_rt2;

            // Perform 4D rotation in YW plane
            let [cos, sin] = [Math.cos(rotAngle.current), Math.sin(rotAngle.current)];
            let newY = cos * y - sin * w;
            let newW = sin * y + cos * w;

            // Project to 3D
            if (doOrtho.current) {
                outputPt.set(x, newY, z);   
            } else {
                let invW = 1 / (1 - newW);
                outputPt.set(x * invW, newY * invW, z * invW);
            }
        }, numSubdivisions, numSubdivisions);

        // Set mesh's geometry if exists
        if (mesh.current) {
            mesh.current.geometry.dispose();
            mesh.current.geometry = geom;
        } else {
            // If no mesh yet, create it
            mesh.current = new Mesh(geom, mat.current);
            scene.current.add(mesh.current);
        }
    }, []);

    /*
    Animation loop.
    */

    const mainLoop = useCallback((time) => {
        // Render scene
        updateGeometry();
        renderer.current.render(scene.current, camera.current);

        // Autorotate if need be
        if (doRotate.current) {
            let delta = 0;
            if (prevTime.current) {
                delta = time - prevTime.current;
            }
            rotAngle.current += speed * delta;
        } 

        // Handle rotation button/keys being pressed
        else if (rotationDirection.current === ROTATING_FORWARD) {
            rotAngle.current -= deltaAngle;
        } else if (rotationDirection.current === ROTATING_BACKWARD) {
            rotAngle.current += deltaAngle;
        }
        prevTime.current = time;

        frameRef.current = requestAnimationFrame(mainLoop);
    }, [updateGeometry]);
    
    const startLoop = useCallback(() => {
        // Starts the animation frame loop
        frameRef.current = requestAnimationFrame(mainLoop);
    }, [mainLoop]);

    const stopLoop = useCallback(() => {
        // Stops the animation loop
        cancelAnimationFrame(frameRef.current);
    }, []);

    const handleRotPause = useCallback(() => {
        // Handle playing/pausing rotation
        if (doRotate.current) {
            iconRef.current.innerHTML = "play_arrow";
        } else {
            iconRef.current.innerHTML = "pause";
        }
        doRotate.current = !doRotate.current;
    }, []);

    /*
    Handling manual rotation.
    */

    const rotateForward = useCallback(() => {
        // Rotate forward through 4D space
        rotationDirection.current = ROTATING_FORWARD;
    }, []);

    const rotateBackward = useCallback(() => {
        // Rotate backward through 4D space
        rotationDirection.current = ROTATING_BACKWARD;
    }, []);

    const stopRotating = useCallback(() => {
        // Handle a key being released
        rotationDirection.current = NOT_ROTATING;
    }, []);

    const onKeyPress = useCallback((evt) => {
        // Handle keyboard rotation
        if (evt.key === "ArrowUp") {
            rotateBackward();
        } else if (evt.key === "ArrowDown") {
            rotateForward();
        } else {
            stopRotating();
        }
    }, [rotateForward, rotateBackward, stopRotating]);

    /*
    Handling resizing.
    */

    const handleResize = useCallback((scl) => {
        // Check for undersized screens
        if (scl.isMobile) {
            stopLoop();
        } else if (isMobile.current) {
            startLoop();
        }
        isMobile.current = scl.isMobile;

        // Set scale
        sclInfo.current = scl;

        if (renderer.current) {
            renderer.current.setSize(scl.width, scl.height);
            camera.current.aspect = scl.aspect;
            camera.current.updateProjectionMatrix();
        }
    }, [startLoop, stopLoop]);

    /*
    Initializing the demo.
    */

    const onTextureLoad = useCallback((tex) => {
        // Create the material
        tex.mapping = EquirectangularReflectionMapping;
        mat.current = new MeshPhysicalMaterial({
            roughness: 0, 
            color: 0x4d6cfa, 
            reflectivity: 0.8,
            envMap: tex,
            side: DoubleSide});

        // Start animation loop
        if (!isMobile.current) {
            startLoop();
        }
    }, [startLoop]);

    const initialize = useCallback(() => {
        // Create renderer and scene
        let scl = sclInfo.current;
        renderer.current = new WebGLRenderer({canvas: canvasRef.current});
        renderer.current.setPixelRatio(window.devicePixelRatio);
        renderer.current.setSize(scl.width, scl.height);
        renderer.current.setClearColor(0x121212);

        scene.current = new Scene();

        // Create camera and orbit controls
        camera.current = new PerspectiveCamera(45, scl.aspect, 1, 1000);
        orbitCtrls.current = new OrbitControls(camera.current, canvasRef.current);

        camera.current.position.set(0, 2, 5);
        camera.current.lookAt(new Vector3(0, 0, 0));
        orbitCtrls.current.update();

        // Add some simple three-point lighting and create the material
        const light0 = new DirectionalLight(lightColor, 2);
        const light1 = new DirectionalLight(lightColor, 2);
        const light2 = new DirectionalLight(lightColor, 2);
        const ambLight = new AmbientLight(lightColor, 0.3);

        light0.position.set(0, -500, 200);
        light1.position.set(500, -200, 200);
        light2.position.set(500, 200, -200);
        scene.current.add(light0, light1, light2, ambLight);
        
        // Add keyboard events
        window.addEventListener("keydown", onKeyPress);
        window.addEventListener("keyup", stopRotating);
        
        // Load environment map
        new TextureLoader().load(
            require("./envmap.png"),
            onTextureLoad);

        // Unloading things
        return () => {
            window.addEventListener("keydown", onKeyPress);
            window.addEventListener("keyup", stopRotating);
            stopLoop();
        }
    }, [onTextureLoad, onKeyPress, stopRotating, stopLoop]);

    return (<>
        <title>Clifford torus | Zenzicubic</title>
        <CanvasDemo title="Clifford torus" canvasRef={canvasRef} onInitialize={initialize} onResize={handleResize}>
            <p>This is an interactive visualization of the <a href="https://en.wikipedia.org/wiki/Clifford_torus" target="_blank" rel="noopener noreferrer">Clifford torus</a>, a 4-dimensional analogue of the familiar 3-dimensional torus.</p>

            <Accordion sections={[
                {title: "What is this?", content: <p>
                    The Clifford torus is the Cartesian product of two circles, meaning that the Clifford torus is composed of all pairs of complex numbers of unit magnitude, and can be parameterized as such:
                    <MathJax>{`\\(
                        T = \\left\\{ (e^{i \\theta}, e^{i \\varphi}) \\ | \\ 0 \\leq 
                        \\theta \\lt 2 \\pi, 0 \\leq \\varphi \\lt 2 \\pi \\right\\}
                    \\)`}</MathJax><br />

                    For this visualization, I&apos;ve rescaled it by a factor of <MathJax inline>{'\\(\\frac{1}{\\sqrt{2}}\\)'}</MathJax> so that it lies on the unit 3-sphere. This demo supports two projections: stereographic and orthographic. The orthographic projections of the Clifford torus are self-intersecting surfaces called <a href="https://mathcurve.com/surfaces.gb/boheme/boheme.shtml" target="_blank" rel="noopener noreferrer">Bohemian domes</a>.
                </p>},
                {title: "How do I use this?", content: <p>
                    Click and drag to rotate the Clifford torus in 3D. The surface can also be rotated in the YW plane to see its internal structure using the up and down arrow keys or the buttons on the right. To play or pause automatic 4D rotation, press <span className="material-icons small">play_arrow</span>/<span className="material-icons small">pause</span>. Use the toggle to choose between orthographic and stereographic projection.
                </p>}
            ]} />
            <hr />

            <Toggle label="Orthographic projection" isToggled={doOrtho.current} name="doOrtho" onChange={(toggled) => {
                doOrtho.current = toggled;
            }} />
            <button onClick={handleRotPause}>
                <span className="material-icons" ref={iconRef}>pause</span>
            </button>
        </CanvasDemo>
        <div className="button-menu">
            <PressableIcon onPress={rotateForward} onRelease={stopRotating}>rotate_left</PressableIcon>
            <PressableIcon onPress={rotateBackward} onRelease={stopRotating}>rotate_right</PressableIcon>
        </div>
    </>);
}

export default CliffordTorusDemo;