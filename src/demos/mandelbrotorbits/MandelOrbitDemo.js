/**
 * This is the Mandelbrot set orbit demo.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

import React from 'react';
import { useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

import { Complex, complex } from '../../math';
import { CanvasDemo } from '../../components/demos/demos';
import Toggle from '../../components/toggle/Toggle';
import fractalImg from './mandelbrot_set.png';

// Constants
const fracScl = 1.5;
const nIterations = 150;
const bailout = 100;

function MandelOrbitDemo() {
    // Canvas, image, and context
    const canvasRef = useRef(null);
    const ctx = useRef(null);
    const imageRef = useRef(null);

    // Scale
    const sclInfo = useRef({width: 0, height: 0, hInv: 0});
    const isMobile = useRef(false);

    // Params and animation frame
    const frameRef = useRef(null);
    const hasClicked = useRef(false);
    const doLines = useRef(true);

    // Mouse things
    const mousePos = useRef(Complex.ZERO);
    const isDragging = useRef(false);

    /*
    Remaps a point to and from screenspace.
    */

    const remapFromScreenSpace = (z) => {
        z = z.mulRe(sclInfo.current.height / fracScl);
        return complex(
            0.5 * (z.x + sclInfo.current.width),
            0.5 * (sclInfo.current.height - z.y));
    }

    const remapToScreenSpace = (mouseX, mouseY) => {
        let nX = (2 * mouseX - sclInfo.current.width);
        let nY = (sclInfo.current.height - 2 * mouseY);
        return complex(nX, nY).mulRe(sclInfo.current.invH * fracScl);
    }

    /*
    Redraw the image.
    */

    const redrawImg = useCallback(() => {
        if (!imageRef.current) return;

        let scl = sclInfo.current;
        let nWidth = 3 * scl.height;
        let imgX = scl.hW - nWidth * 0.5;
        ctx.current.drawImage(imageRef.current, 
            imgX, 0,
            nWidth, scl.height);
    }, []);

    /*
    Draw the orbit.
    */

    const drawOrbit = useCallback(() => {
        ctx.current.strokeStyle = "white";
        ctx.current.fillStyle = "white";

        // Get points
        let z = mousePos.current;
        let newZ, c = z;
        let rA, rB;

        // Draw initial point
        rA = remapFromScreenSpace(z);
        ctx.current.beginPath();
        ctx.current.arc(rA.x, rA.y, 5, 0, 2 * Math.PI);
        ctx.current.fill();

        // Draw trail
        for (let i = 0; i < nIterations; i ++) {
            // Apply iteration
            newZ = z.sqr().add(c);
            rB = remapFromScreenSpace(newZ);

            if (doLines.current) {
                // Draw lines
                ctx.current.beginPath();
                ctx.current.moveTo(rA.x, rA.y);
                ctx.current.lineTo(rB.x, rB.y);
                ctx.current.stroke();
            }

            // Draw point
            ctx.current.beginPath();
            ctx.current.arc(rB.x, rB.y, 2, 0, 2 * Math.PI);
            ctx.current.fill();

            if (newZ.magSq() > bailout) break;
            rA = rB;
            z = newZ;
        }
    }, []);

    /*
    Animation loop.
    */
   
    const mainLoop = useCallback(() => {
        ctx.current.clearRect(0, 0, sclInfo.current.width, sclInfo.current.height);
        redrawImg();

        if (hasClicked.current) {
            drawOrbit();
        }
        frameRef.current = requestAnimationFrame(mainLoop);
    }, [drawOrbit, redrawImg]);

    /*
    Handle window rescaling.
    */

    const resize = useCallback((scl) => {
        // Start/pause animation
        if (scl.isMobile) {
            cancelAnimationFrame(frameRef.current);
        } else if (isMobile.current) {
            mainLoop();
        }
        isMobile.current = scl.isMobile;

        // Set scale info
        sclInfo.current = scl;
    }, [mainLoop]);

    /*
    Handle mouse move.
    */

    const handleMove = useCallback((mouseX, mouseY) => {
        if (!isDragging.current) return;

        hasClicked.current = true;
        mousePos.current = remapToScreenSpace(mouseX, mouseY);
    }, [])

    /*
    Load the window.
    */

    const initialize = useCallback(() => {
        // Create canvas
        ctx.current = canvasRef.current.getContext("2d");

        // Load image
        let img = new Image();
        img.src = fractalImg;
        img.onload = () => {
            imageRef.current = img;
            if (!isMobile.current) {
                mainLoop();
            }
        }

        return () => {
            cancelAnimationFrame(frameRef.current);
        }
    }, [mainLoop]);

    return (<>
        <title>Mandelbrot orbits | Zenzicubic</title>
        <CanvasDemo title="Mandelbrot orbits" canvasRef={canvasRef} onInitialize={initialize} 
            onResize={resize} onInteractionStart={() => isDragging.current = true }
            onInteractionMove={handleMove} onInteractionEnd={() => isDragging.current = false }>
                <p>This is a visualization of the internal orbits of the Mandelbrot set. I have more info <Link to="/articles/mandelbrotexplained">here</Link>. Click and drag, and a path will emerge.</p>
                <hr />
                <Toggle isToggled={doLines.current} label="Show lines" onChange={(toggled) => {
                    doLines.current = toggled;
                }} />
        </CanvasDemo>    
    </>);
}

export default MandelOrbitDemo;