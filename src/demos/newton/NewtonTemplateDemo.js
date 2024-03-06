/**
 * This is a generic "child" demo that all of the Newton fractal-related
 * demos rely on. It has zooming and dragging support, and runs WebGL.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
*/
import React from 'react';
import { useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import { WebGLRenderer, Scene, OrthographicCamera, Vector2,
    ShaderMaterial, PlaneGeometry, GLSL3, Mesh } from 'three';

import ZoomMenu from '../../components/buttons/ZoomMenu';
import { CanvasDemo } from '../../components/demos/demos';
import { ZoomDirection } from '../../components/buttons/ZoomMenu';
import { Vector, vec2 } from '../../math';

const NewtonTemplateDemo = forwardRef(function NewtonTemplateDemo(props, ref) {
    const invZoomFac = 1 / props.zoomFac;

    // Canvas and ThreeJS components
    const canvasRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    
    // Fragment shader
    const shaderRef = useRef(null);

    // Scaling and animation frame
    const frameRef = useRef(null);
    const isMobile = useRef(false);
    const sclInfo = useRef(null);

    // Mouse and center point
    const isDragging = useRef(false);
    const cen = useRef(Vector.ZERO);
    const startPt = useRef(null);
    const startCen = useRef(null);

    // Uniforms and scale
    const scaleFac = useRef(props.initialScl);
    const zoomDir = useRef(0);
    const uniforms = useRef({
        size: {value: new Vector2(0, 0)},
        cen: {value: new Vector2(0, 0)},
        dispScl: {value: scaleFac.current},
        scale: {value: 0},
    });

    /*
    Mapping to screen space.
    */

    const mapToScreenSpace = useCallback((mouseX, mouseY) => {
        let scl = sclInfo.current;
        let posX = (2 * mouseX - scl.width) / scl.scale;
        let posY = (scl.height - 2 * mouseY) / scl.scale;
        return vec2(posX, posY).scale(scaleFac.current);
    }, []);

    /*
    Main animation loop.
    */

    const mainLoop = useCallback(() => {
        // Zoom if applicable
        if (zoomDir.current === ZoomDirection.ZOOMING_IN) {
            scaleFac.current *= props.zoomFac;
            uniforms.current.dispScl.value = scaleFac.current;
        } else if (zoomDir.current === ZoomDirection.ZOOMING_OUT) {
            scaleFac.current *= invZoomFac;
            uniforms.current.dispScl.value = scaleFac.current;
        }

        // Render
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        frameRef.current = requestAnimationFrame(mainLoop);
    }, [props, invZoomFac]);

    const startLoop = useCallback(() => {
        // Starts the animation loop
        frameRef.current = requestAnimationFrame(mainLoop);
    }, [mainLoop]);

    const stopLoop = useCallback(() => {
        // Stops the animation loop
        cancelAnimationFrame(frameRef.current);
    }, []);

    /*
    Handling scaling of the app.
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
    Mouse dragging and zooming.
    */

    const beginDrag = useCallback((mouseX, mouseY) => {
        // Stores the mouse position on drag start
        isDragging.current = true;

        let mappedPos = mapToScreenSpace(mouseX, mouseY);
        startPt.current = mappedPos;
        startCen.current = cen.current.clone();
    }, [mapToScreenSpace]);

    const onDrag = useCallback((mouseX, mouseY) => {
        // Update on drag
        if (!isDragging.current) return;

        // Compute change in position and add it to center point
        let mappedPos = mapToScreenSpace(mouseX, mouseY);
        let delta = mappedPos.sub(startPt.current);
        let nCen = startCen.current.add(delta);

        // Set the center uniform
        cen.current = nCen;
        uniforms.current.cen.value.set(nCen.x, nCen.y);
    }, [mapToScreenSpace]);

    const resetDisplay = useCallback(() => {
        // Reset the zoom and position
        scaleFac.current = props.initialScl;
        cen.current = Vector.ZERO;

        uniforms.current.dispScl.value = props.initialScl;
        uniforms.current.cen.value.set(0, 0);
    }, [props]);

    /*
    Initialization.
    */

    const prepareRenderer = useCallback(() => {
        // Initialize Three components
        rendererRef.current = new WebGLRenderer({canvas: canvasRef.current});
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

        // Start and set scale if not on mobile
        if (isMobile.current) return;
    
        let scl = sclInfo.current;
        rendererRef.current.setSize(scl.width, scl.height);
        startLoop();
    }, [startLoop]);

    const initialize = useCallback(() => {
        // Create required uniforms
        if (props.uniforms) {
            for (let uniform of props.uniforms) {
                uniforms.current[uniform.name] = {value: uniform.value};
            }
        }

        // Load shader and create renderer on load
        fetch(props.shaderPath)
            .then((res) => res.text())
            .then((res) => { 
                shaderRef.current = res;
                prepareRenderer();
            });

        return stopLoop;
    }, [props, prepareRenderer, stopLoop]);
   
    /*
    Exposing some methods.
    */

    useImperativeHandle(ref, () => ({
        getImageURL() {
            // Gets a download URL of the canvas image
            return canvasRef.current.toDataURL().replace("png", "octet-stream");
        },
        setUniform(name, val){ uniforms.current[name].value = val; }
    }));

    return (<>
        <title>{props.title} | Zenzicubic</title>

        <CanvasDemo title={props.title} canvasRef={canvasRef} onInitialize={initialize} 
            onResize={handleResize} onInteractionStart={beginDrag} onInteractionMove={onDrag} 
            onInteractionEnd={() => isDragging.current = false}>
                {props.children}
        </CanvasDemo> 
        
        <ZoomMenu onZoom={(dir) => { zoomDir.current = dir; }} onReset={resetDisplay} />
    </>);
});

export default NewtonTemplateDemo;