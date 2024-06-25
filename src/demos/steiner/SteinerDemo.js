/**
 * This is the Steiner chain demo.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */
import React from 'react';
import { useRef, useCallback } from 'react';
import { MathJax } from 'better-react-mathjax';

import Accordion from '../../components/accordion/Accordion';
import Slider from '../../components/slider/Slider';

import { Complex, MoebiusTransformation, Circle, complex, cis } from '../../math';
import { CanvasDemo } from '../../components/demos/demos';

// Constants
const dt = 5e-3;
const sclFac = 0.4;
const ptRad = 10;

function SteinerDemo() {
    // Canvas and context
    const canvasRef = useRef(null);
    const ctx = useRef(null);

    // Scale info
    const sclInfo = useRef(null);
    const isMobile = useRef(false);

    // Animation stuff
    const timeVal = useRef(0);
    const frameRef = useRef(null);
    const isPlaying = useRef(true);
    const iconRef = useRef(null);

    // Geometry info
    const nCircles = useRef(10);

    // Moebius transform
    const circTran = useRef(null);
    const circPt = useRef(complex(-0.7, 0));

    // Mouse stuff
    const isDragging = useRef(false);
    const startPt = useRef(null);
    const startMousePt = useRef(null);

    /*
    Animation and calculation stuff.
    */

    const drawCircle = useCallback((circ) => {
        // Draws a circle on the canvas
        let scl = sclInfo.current.scale;
        ctx.current.beginPath();
        ctx.current.arc(circ.cen.x * scl, circ.cen.y * scl, circ.rad * scl, 0, 2 * Math.PI);
        ctx.current.stroke();
    }, []);

    const drawCircles = useCallback(() => {
        // Compute some useful values
        let N = nCircles.current;
        let sin = Math.sin(Math.PI / N);
        let fac = 1 / (1 + sin);

        // Draw the ring of tangent circles
        ctx.current.strokeStyle = "#FC6255";
        let tran = circTran.current;
        let t, pt, circ;
        for (let i = 0; i < N; i ++) {
            t = 2 * Math.PI * i / N + timeVal.current;
            pt = cis(t).mulRe(fac);
            circ = new Circle(pt, sin * fac);
            drawCircle(tran.transformCircle(circ));
        }

        // Draw the inner and outer circles
        circ = new Circle(Complex.ZERO, (1 - sin) * fac);

        ctx.current.strokeStyle = "white";
        ctx.current.lineWidth = 2;
        drawCircle(new Circle(Complex.ZERO, 1));
        ctx.current.strokeStyle = "#58C4DD";
        drawCircle(tran.transformCircle(circ));

        // Draw the control point
        let scl = sclInfo.current.scale;
        let ptPos = circPt.current;

        ctx.current.fillStyle = "white";
        ctx.current.beginPath();
        ctx.current.arc(ptPos.x * scl, ptPos.y * scl, ptRad, 0, 2 * Math.PI);
        ctx.current.fill();
    }, [drawCircle]);

    /*
    Animation stuff.
    */

    const mainLoop = useCallback(() => {
        // Main animation loop
        let scl = sclInfo.current;
        ctx.current.clearRect(-scl.hW, -scl.hH, scl.width, scl.height);
        drawCircles();

        // Update time value
        if (isPlaying.current) {
            timeVal.current += dt;
        }
        frameRef.current = requestAnimationFrame(mainLoop);
    }, [drawCircles]);

    const startLoop = useCallback(() => {
        // Starts the main animation loop
        frameRef.current = requestAnimationFrame(mainLoop);
    }, [mainLoop]);

    const stopLoop = useCallback(() => {
        // Cancels the animation frame
        cancelAnimationFrame(frameRef.current);
    }, []);

    const setPlayState = useCallback(() => {
        // Play/pause the animation frame
        isPlaying.current = !isPlaying.current;
        if (isPlaying.current) {
            iconRef.current.innerHTML = "pause";
        } else {
            iconRef.current.innerHTML = "play_arrow";
        }
    }, []);

    /*
    Mouse stuff.
    */

    const updateTransform = useCallback(() => {
        // Updates the Moebius transformation.
        let pt = circPt.current;
        circTran.current = new MoebiusTransformation(
            Complex.ONE, pt,
            pt.conj(), Complex.ONE);
    }, []);

    const mapToScreenSpace = useCallback((posX, posY) => {
        // Maps a point to screen space
        let scl = sclInfo.current;
        return complex(
            (posX - scl.hW) / scl.scale,
            (scl.hH - posY) / scl.scale);
    }, []);

    const onDragStart = useCallback((posX, posY) => {
        // Check if the user is dragging within the point
        let mappedPt = mapToScreenSpace(posX, posY);
        let scl = sclInfo.current.scale;

        if (mappedPt.dist(circPt.current) < ptRad / scl) {
            startPt.current = circPt.current;
            startMousePt.current = mappedPt;
            isDragging.current = true;
        }
    }, [mapToScreenSpace]);

    const onDrag = useCallback((posX, posY) => {
        // Update point position and transform if dragging
        let mappedPt = mapToScreenSpace(posX, posY);
        if (isDragging.current) {
            let delta = mappedPt.sub(startMousePt.current);

            circPt.current = startPt.current.add(delta);
            updateTransform();
        }
    }, [mapToScreenSpace, updateTransform]);

    /*
    Handling resizing.
    */

    const transformCanvas = useCallback(() => {
        // Translate the canvas center and flip the canvas orientation
        let scl = sclInfo.current;
        ctx.current.resetTransform();
        ctx.current.translate(scl.hW, scl.hH);
        ctx.current.scale(1, -1);
    }, []);

    const handleResize = useCallback((scl) => {
        // Handle devices that are too small
        if (scl.isMobile) {
            stopLoop();
        } else if (isMobile.current) {
            startLoop();
        }
        isMobile.current = scl.isMobile;

        // Set scale values
        let {width, height} = scl;
        let scale = Math.min(width, height);
        sclInfo.current = {...scl, scale: scale * sclFac};

        // Transform canvas if needed
        if (ctx.current) {
            transformCanvas();
        }
    }, [startLoop, stopLoop, transformCanvas]);

    /*
    Initialization.
    */

    const initialize = useCallback(() => {
        // Get canvas context
        ctx.current = canvasRef.current.getContext("2d");
        updateTransform();
        transformCanvas();

        // Start/stop animation
        if (!isMobile.current) {
            startLoop();
        }
        return stopLoop;
    }, [updateTransform, transformCanvas, startLoop, stopLoop]);

    return (<>
        <title>Steiner chains | Zenzicubic</title>
        <CanvasDemo title="Steiner chains" canvasRef={canvasRef} onInitialize={initialize} 
            onResize={handleResize} onInteractionStart={onDragStart} onInteractionMove={onDrag}
            onInteractionEnd={() => isDragging.current = false}>
            <p>This is a visualization of <a href="https://en.wikipedia.org/wiki/Steiner_chain" target="_blank" rel="noopener noreferrer">Steiner chains</a>, and their relationship to M&ouml;bius transformations.</p>

            <Accordion title="What is this?">
                Suppose we have two non-intersecting circles <MathJax inline>{'\\(C_a\\)'}</MathJax> and <MathJax inline>{'\\(C_b\\)'}</MathJax>. If we can create a chain of <MathJax inline>{'\\(n\\)'}</MathJax> circles that are tangent to both <MathJax inline>{'\\(C_a\\)'}</MathJax> and <MathJax inline>{'\\(C_b\\)'}</MathJax>, then we can create infinitely many such chains. This theorem is called Steiner&apos;s porism, and the chains of circles are called Steiner chains. Here, we consider the case where each circle in the ring is tangent to its neighbors.<br /><br />

                To create the chains, we draw circles at the vertices of a regular polygon, scaled so that they are tangent to the unit circle. To convert this &quot;special&quot; Steiner chain to a more general Steiner chain, we apply a M&ouml;bius transformation which preserves the unit circle. Specifically, we apply the mapping<br />
                <MathJax>{`\\(\\begin{align*}
                    z \\mapsto \\frac{z + a}{\\overline{a}z + 1}    
                \\end{align*}\\)`}</MathJax>
                which takes the origin to the complex number <MathJax inline>{'\\(a\\)'}</MathJax> while preserving the unit circle.
            </Accordion>
            <Accordion title="How do I use this?">
                Click and drag the white point to change <MathJax inline>{'\\(a.\\)'}</MathJax> Use the slider to change the number of circles, and press <span className="material-icons small">play_arrow</span>/<span className="material-icons small">pause</span> to play or pause the rotation animation.
            </Accordion>

            <hr />
            <Slider label="No. circles" min="3" max="20" step="1" 
                value={nCircles.current} onChange={(n) => {
                    nCircles.current = n;
            }} />

            <button onClick={setPlayState}>
                <span className="material-icons" ref={iconRef}>pause</span>
            </button>
        </CanvasDemo>
    </>);
}

export default SteinerDemo;