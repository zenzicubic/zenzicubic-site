/**
 * This is the spirograph demo.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */
import React from 'react';
import { useRef, useState, useCallback } from 'react';

import Accordion from '../../components/accordion/Accordion';
import ColorPicker from '../../components/colorpicker/ColorPicker';
import Checkbox from '../../components/checkbox/Checkbox';

import { CanvasDemo } from '../../components/demos/demos';
import { colors } from '../../components/colorpicker/ColorPicker';
import { ButtonGroup } from '../../components/groups/groups';
import { Vector, vec2, versor } from '../../math';

import './spirograph.css';

// Geometry constants
const ptRad = 15;
const nCircles = 30;
const curveThickness = 1.5;

const outerRad = nCircles * 0.5;
const sclFac = 1 / nCircles;

// Time and animation constants
const nSteps = 5;
const dt = 5e-3;

// The actual demo
function SpirographDemo() {
    // Canvas things
    const canvasRef = useRef(null);
    const ctx = useRef(null);
    const imgData = useRef(null);

    // Scale info
    const sclInfo = useRef(null);
    const isMobile = useRef(false);

    // Animation stuff
    const iconRef = useRef(null);
    const isPlaying = useRef(false);
    const frameRef = useRef(null);
    const timeVal = useRef(0);
    const lastPt = useRef(null);

    // Mouse things
    const isDragging = useRef(false);
    const initialMouseX = useRef(null);
    const startDis = useRef(null);

    // Spirograph properties
    const [selGear, setSelGear] = useState(11);
    const doGears = useRef(true);

    const colIdx = useRef(6);
    const distInner = useRef(2);
    const gearRad = useRef(0.5 * selGear);

    /*
    Drawing stuff.
    */

    const clearBuffer = useCallback(() => {
        // Clears the drawing buffer
        imgData.current = null;
    }, []);

    const getCurvePt = useCallback((t) => {
        // Get the circle's center
        let innerRad = gearRad.current;
        let circPt = versor(t).scale(outerRad - innerRad);

        // Get the point on the curve
        let curveVec = versor(t * (outerRad - innerRad) / innerRad).scale(distInner.current);
        let curvePt = vec2(circPt.x + curveVec.x, circPt.y - curveVec.y);

        return [circPt, curvePt];
    }, []);

    const drawCircle = useCallback((cen, rad) => {
        // Draws a circle on the canvas
        let scl = sclInfo.current.scale;
        ctx.current.beginPath();
        ctx.current.arc(cen.x * scl, cen.y * scl, rad * scl, 0, 2 * Math.PI);
        ctx.current.stroke();
    }, []);

    const drawCurve = useCallback(() => {
        let scl = sclInfo.current.scale;

        // Draw the first point on the curve
        ctx.current.strokeStyle = colors[colIdx.current];
        ctx.current.lineWidth = curveThickness;

        ctx.current.beginPath();
        if (lastPt.current) {
            ctx.current.moveTo(lastPt.current.x * scl, lastPt.current.y * scl);
        }

        // Draw some more points
        let curvePt;
        let t = timeVal.current;
        for (let i = 0; i < nSteps; i ++) {
            curvePt = getCurvePt(t)[1];
            ctx.current.lineTo(curvePt.x * scl, curvePt.y * scl);
            t += dt;
        }
        ctx.current.stroke();
    
        // Update time and point
        timeVal.current = t;
        lastPt.current = curvePt;
    }, [getCurvePt]);

    const drawGears = useCallback(() => {
        if (!doGears.current) return;
        let scl = sclInfo.current.scale;

        // Draw the outer gear
        ctx.current.strokeStyle = "white";
        ctx.current.lineWidth = 3;
        drawCircle(Vector.ZERO, outerRad);

        // Draw the inner gear
        let t = (isPlaying.current ? timeVal.current : 0);
        let [circPt, curvePt] = getCurvePt(t);
        drawCircle(circPt, gearRad.current);

        // Draw the line
        ctx.current.beginPath();
        ctx.current.moveTo(circPt.x * scl, circPt.y * scl);
        ctx.current.lineTo(curvePt.x * scl, curvePt.y * scl);
        ctx.current.stroke();

        // Draw the point
        ctx.current.fillStyle = "white";
        ctx.current.beginPath();
        ctx.current.arc(curvePt.x * scl, curvePt.y * scl, ptRad, 0, 2 * Math.PI);
        ctx.current.fill();
    }, [drawCircle, getCurvePt]);
    
    const draw = useCallback(() => {
        // Clear canvas
        let scl = sclInfo.current;
        ctx.current.clearRect(-scl.hW, -scl.hH, scl.width, scl.height);
        
        // Draw buffer contents
        if (imgData.current) {
            ctx.current.putImageData(imgData.current, 0, 0);
        }

        if (isPlaying.current) {
            // Draw curve if animating
            drawCurve();
            imgData.current = ctx.current.getImageData(0, 0, scl.width, scl.height);
        }

        // Draw gears
        drawGears();
    }, [drawCurve, drawGears]);

    /*
    Downloads an image of the spirograph.
    */

    const saveImg = useCallback(() => {
        let elt = document.createElement("a");
        elt.href = canvasRef.current.toDataURL();
        elt.download = "spirograph.png";
        elt.click();
    }, []);

    /*
    Animation frame stuff.
    */

    const mainLoop = useCallback(() => {
        // The main animation loop
        draw();
        frameRef.current = requestAnimationFrame(mainLoop);
    }, [draw]);

    const startLoop = useCallback(() => {
        // Starts the loop
        frameRef.current = requestAnimationFrame(mainLoop);
    }, [mainLoop]);

    const stopLoop = useCallback(() => {
        // Ends the animation loop
        cancelAnimationFrame(frameRef.current);
    }, []);

    const setPlayState = useCallback(() => {
        // Play/pause the animation
        isPlaying.current = !isPlaying.current;
        if (isPlaying.current) {
            iconRef.current.innerHTML = "pause";
        } else {
            iconRef.current.innerHTML = "play_arrow";
        }
    }, []);

    /*
    Handling mouse events.
    */

    const remapPt = useCallback((posX, posY) => {
        // Remaps a point to screen space
        let scl = sclInfo.current;
        return vec2(posX - scl.hW, posY - scl.hH).div(scl.scale);
    }, []);

    const onDragStart = useCallback((posX, posY) => {
        // Remap mouse coordinates
        let mappedPt = remapPt(posX, posY);
        let dotRad = ptRad / sclInfo.current.scale;

        // Check if we can drag
        let mappedX = mappedPt.x - distInner.current - outerRad + gearRad.current;
        let isSelected = (Math.hypot(mappedX, mappedPt.y) < dotRad);

        if (!isPlaying.current && doGears.current && isSelected) {
            // If so, store initial position
            isDragging.current = true;
            initialMouseX.current = mappedPt.x;
            startDis.current = distInner.current;
        }
    }, [remapPt]);

    const onDrag = useCallback((posX) => {
        if (isDragging.current) {
            // Compute differences
            let mappedX = remapPt(posX).x;
            let delta = mappedX - initialMouseX.current;

            // Update distance
            let newDis = startDis.current + delta;
            distInner.current = Math.max(0, Math.min(newDis, gearRad.current));
            lastPt.current = null;
        }
    }, [remapPt]);

    /*
    Handling scaling of the demo.
    */

    const transformCanvas = useCallback(() => {
        // Translate the canvas
        let scl = sclInfo.current;
        ctx.current.resetTransform();
        ctx.current.translate(scl.hW, scl.hH);
    }, []);

    const handleResize = useCallback((scl) => {
        // Handle mobile
        if (scl.isMobile) {
            stopLoop();
        } else if (isMobile.current) {
            startLoop();
        }
        isMobile.current = scl.isMobile;

        // Set size/scale
        let {width, height} = scl;
        let scale = Math.min(width, height) * sclFac;
        sclInfo.current = {...scl, scale};

        // Transform and clear
        if (ctx.current) {
            clearBuffer();
            transformCanvas();
        }
    }, [startLoop, stopLoop, clearBuffer, transformCanvas]);

    /*
    Initializing the demo.
    */

    const initialize = useCallback(() => {
        // Create the context
        ctx.current = canvasRef.current.getContext("2d", { willReadFrequently: true });
        transformCanvas();

        // Start/stop animation
        if (!isMobile.current) {
            startLoop();
        }
        return stopLoop;
    }, [transformCanvas, startLoop, stopLoop])

    return (<>
        <title>Spirograph | Zenzicubic</title>
        <CanvasDemo title="Spirograph" canvasRef={canvasRef} onInitialize={initialize} 
            onResize={handleResize} onInteractionStart={onDragStart} onInteractionMove={onDrag} 
            onInteractionEnd={() => isDragging.current = false}>
            <p>This is a web version of the Spirograph, the classic children&apos;s toy. You can choose different &quot;gears&quot; and colors to make your own designs. In technical terms, both this demo and the toy draw <a href="https://en.wikipedia.org/wiki/Hypotrochoid" target="_blank" rel="noopener noreferrer">hypotrochoids</a>.</p>

            <Accordion title="How do I use this?">
                Select a gear from the list, and use the color picker to choose the color of the curve being drawn. Press <span className="material-icons small">play_arrow</span>/<span className="material-icons small">pause</span> to play or pause the animation, and <span className="material-icons small">delete</span> to clear the canvas. Press <span className="material-icons small">save</span> to save your creation. If the animation is paused, you can change the position of the trace point by clicking and dragging the white circle. Use the checkbox to show or hide the gears.
            </Accordion>

            <hr />
            <ButtonGroup>
                <button onClick={setPlayState}>
                    <span className="material-icons" ref={iconRef}>play_arrow</span>
                </button>
                <button onClick={clearBuffer}>
                    <span className="material-icons">delete</span>
                </button>
                <button onClick={saveImg}>
                    <span className="material-icons">save</span>
                </button>
            </ButtonGroup>

            <hr />
            <ColorPicker label="Color:" selIdx={colIdx.current} onChange={(idx) => { colIdx.current = idx; }}/>
        

            <p>Gears:</p>
            <div id="spirograph-gears">
                {[...Array(nCircles - 1).keys()].map((i) => {
                    // Create the gears
                    i ++;
                    if (i !== nCircles * 0.5) {
                        let size = 1.5 + 0.15 * i + "em";
                        return (<button 
                            style={{width: size, height: size}} key={"gear-" + i}
                            className={"spirograph-gear" + (selGear === i ? " selected" : "")}
                            onClick={() => {
                                // Set selected gear, ensuring to clamp the radius
                                gearRad.current = 0.5 * i;
                                distInner.current = Math.min(distInner.current, gearRad.current);

                                lastPt.current = null;
                                setSelGear(i);
                            }}>{i}</button>);
                    } else return "";
                })}
            </div>

            <hr />
            <Checkbox label="Show gears" name="doGears" isChecked={doGears.current} onChange={(checked) => {
                doGears.current = checked;
            }}/>
        </CanvasDemo>
    </>);
}

export default SpirographDemo;