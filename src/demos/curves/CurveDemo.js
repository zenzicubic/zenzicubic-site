/**
 * This is a generic demo component for curve-related visualizations.
 * It has play/pause functionality, and controls the main aspects of rendering.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */
import React from 'react';
import { useRef, useCallback, forwardRef, useImperativeHandle } from 'react';

import { CanvasDemo } from '../../components/demos/demos';
import { vec2 } from '../../math';

// Constants
export const colors = {
    red: "#FC6255",
    blue: "#58C4DD",
    green: "#83C167",
    yellow: "#FFFF00"
};

// The component
const CurveDemo = forwardRef(function CurveDemo(props, ref) {
    const paras = props.params;

    // Elements
    const canvasRef = useRef(null);
    const ctx = useRef(null);
    const iconRef = useRef(null);
    
    // Scale
    const sclInfo = useRef(null);
    const isMobile = useRef(false);

    // Animation things
    const isPlaying = useRef(true);
    const frameRef = useRef(null);

    // Control point and dragging functionality
    const isDragging = useRef(false);
    const startPt = useRef(null);
    const ctrlPt = useRef(paras.ptPos);
    const startCtrlPt = useRef(null);

    // Path and points
    const path = useRef([]);
    const geometry = useRef(null);
    const timeVal = useRef(0);
    const startTime = useRef(0);
    
    /*
    Mapping between viewport and canvas space.
    */

    const mapFromScreenSpace = useCallback((mouseX, mouseY) => {
        let scl = sclInfo.current;
        let nX = mouseX - scl.hW;
        let nY = mouseY - scl.hH;
        return vec2(nX, nY).div(paras.sclFac * scl.height);
    }, [paras]);

    /*
    Computing points on the curve.
    */

    const updateGeometryData = useCallback(() => {
        // Updates the geometry data
        geometry.current = props.updateGeometryData(timeVal.current, ctrlPt.current);
    }, [props]);

    const calculate = useCallback(() => {
        // Compute a bunch of points on the pedal curve
        for (let i = 0; i < paras.nSteps; i ++) {
            updateGeometryData();

            // Add point to path
            if (timeVal.current - startTime.current < 2.01 * Math.PI) {
                path.current.push(geometry.current.tracePt);
            }
            timeVal.current += paras.dt;
        }
    }, [paras, updateGeometryData]);

    /*
    Main loop and animation controls.
    */

    const redrawScene = useCallback(() => {
        // Clear the canvas
        let scl = sclInfo.current;
        ctx.current.clearRect(-scl.hW, -scl.hH, scl.width, scl.height);

        // Redraw the scene
        ctx.current.lineWidth = 0.02;
        props.redrawScene(geometry.current);

        // Draw control point
        ctx.current.fillStyle = colors.red;
        ctx.current.beginPath();
        ctx.current.arc(ctrlPt.current.x, ctrlPt.current.y, paras.ptSz, 0, 2 * Math.PI);
        ctx.current.fill();
    }, [props, paras]);

    const mainLoop = useCallback(() => {
        // The main animation frame
        calculate();
        redrawScene();

        frameRef.current = requestAnimationFrame(mainLoop);
    }, [calculate, redrawScene]);

    const startLoop = useCallback(() => {
        // Starts the loop
        frameRef.current = requestAnimationFrame(mainLoop);
    }, [mainLoop]);

    const endLoop = useCallback(() => {
        // Ends the animation loop
        cancelAnimationFrame(frameRef.current);
    }, []);

    const setPlayState = useCallback(() => {
        // Play/pause the animation frame
        isPlaying.current = !isPlaying.current;
        if (isPlaying.current) {
            startLoop();
            iconRef.current.innerHTML = "pause";
        } else {
            endLoop();
            iconRef.current.innerHTML = "play_arrow";
        }
    }, [startLoop, endLoop]);

    /*
    Resize logic.
    */
   
    const transformCanvas = useCallback(() => {
        // Transform the canvas
        let scl = sclInfo.current;

        ctx.current.resetTransform();
        ctx.current.translate(scl.hW, scl.hH);
        ctx.current.scale(scl.scale, scl.scale);
    }, []);

    const onResize = useCallback((scl) => {
        // Deal with mobile
        if (scl.isMobile) {
            endLoop();
        } else if (isMobile.current && isPlaying.current) {
            startLoop();
        }
        isMobile.current = scl.isMobile;

        // Set canvas size
        let {width, height} = scl;
        let scale = Math.min(width, height) * paras.sclFac;
        sclInfo.current = {...scl, scale};

        // Transform context
        if (ctx.current) {
            transformCanvas();
            redrawScene();
        }
    }, [paras, startLoop, endLoop, transformCanvas, redrawScene]);

    /*
    Dragging and updating parameters.
    */

    const resetScene = useCallback(() => {
        // Reset path and time on update
        startTime.current = timeVal.current;
        path.current = [];

        // Redraw scene if paused
        if (!isPlaying.current) {
            updateGeometryData();
            redrawScene();
        }
    }, [updateGeometryData, redrawScene]);

    const startDrag = useCallback((mouseX, mouseY) => {
        // Save initial positions
        let mappedPos = mapFromScreenSpace(mouseX, mouseY);
        if (mappedPos.distance(ctrlPt.current) < paras.ptSz) {
            isDragging.current = true;
            startPt.current = mappedPos;
            startCtrlPt.current = ctrlPt.current;
        }
    }, [paras, mapFromScreenSpace]);

    const onDrag = useCallback((mouseX, mouseY) => {
        if (!isDragging.current) return;

        // Compute difference vector and add it to point position
        let mappedPos = mapFromScreenSpace(mouseX, mouseY);
        let diff = mappedPos.sub(startPt.current);
        ctrlPt.current = startCtrlPt.current.add(diff);

        resetScene();
    }, [resetScene, mapFromScreenSpace]);

    /*
    Initialization.
    */

    const initialize = useCallback(() => {
        ctx.current = canvasRef.current.getContext("2d");
        transformCanvas();
        
        if (!isMobile.current) {
            startLoop();
        }
        return endLoop;
    }, [transformCanvas, startLoop, endLoop]);

    /*
    Exposing some methods.
    */

    useImperativeHandle(ref, () => ({
        getContext() { return ctx.current; },
        getPath(){ return path.current; },
        paramsUpdated: resetScene
    }));

    return (
        <CanvasDemo title={props.title} canvasRef={canvasRef} onInitialize={initialize} 
            onResize={onResize} onInteractionStart={startDrag} onInteractionMove={onDrag} 
            onInteractionEnd={() => { isDragging.current = false; }}>
                {props.children}
                <button onClick={setPlayState}>
                    <span className="material-icons" ref={iconRef}>pause</span>
                </button>
        </CanvasDemo>    
    );
});

export default CurveDemo;