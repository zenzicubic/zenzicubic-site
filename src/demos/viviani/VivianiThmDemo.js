/**
 * This is the Viviani theorem demo.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

import React from 'react';
import { useRef,  useState, useCallback } from 'react';

import { CanvasDemo } from '../../components/demos/demos';
import { vec2 } from '../../math';

const ptX = 0.51;
const barWidth = 8;

// Vertices
const rt3_over_2 = Math.sqrt(0.75);
const verts = [vec2(0, rt3_over_2), vec2(-0.5, 0), vec2(0.5, 0)];

// Area
const e0 = verts[1].sub(verts[0]);
const e1 = verts[2].sub(verts[0]);
const invArea = 1 / e0.cross(e1);

/*
Test for point in the main triangle.
*/

const testPointInTri = (pt) => {
    let dif = pt.sub(verts[0]);

    let u = e0.cross(dif) * invArea;
    let v = dif.cross(e1) * invArea;
    return (u >= 0 && u <= 1 && v >= 0 && v <= 1);
}

/*
The actual component.
*/

function VivianiThmDemo() {
    // Canvas, scale, and context
    const sclInfo = useRef({w: 0, h: 0, hW: 0});
    const canvasRef = useRef(null);
    const ctx = useRef(null);

    // Mouse things
    const pos = useRef(vec2(0, rt3_over_2 / 3));
    const [dragging, setDragging] = useState(false);

    /*
    Redraw the scene.
    */

    const drawLine = (x1, y1, x2, y2) => {
        // Just a generic function that draws a line segment
        let scl = sclInfo.current;
        ctx.current.beginPath();
        ctx.current.moveTo(x1 * scl.height, y1 * scl.height);
        ctx.current.lineTo(x2 * scl.height, y2 * scl.height);
        ctx.current.stroke();
    }

    const drawAltitude = useCallback((i) => {
        // Get vertices
        let pt = pos.current;
        let v1 = verts[i];
        let v2 = verts[(i + 1) % 3];
        
        // Compute vector projection
        let edge = v2.sub(v1);
        let diff = pt.sub(v1);
        let t = edge.dot(diff) / edge.normSq();
        let proj = v1.add(edge.scale(t));

        // Draw line and get length
        ctx.current.lineWidth = 1;
        drawLine(pt.x, pt.y, proj.x, proj.y);
        return proj.distance(pt);
    }, [])

    const redrawScene = useCallback(() => {
        // Clear display
        let scl = sclInfo.current;
        let pt = pos.current;
        ctx.current.clearRect(-scl.hW, 0, scl.width, scl.height);

        if (testPointInTri(pt)) {
            // Draw the altitudes
            ctx.current.strokeStyle = "#FC6255";
            let len = drawAltitude(0);
            ctx.current.lineWidth = barWidth;
            drawLine(ptX, 0, ptX, len);

            ctx.current.strokeStyle = "yellow";
            let nLen = drawAltitude(1);
            ctx.current.lineWidth = barWidth;
            drawLine(ptX, len, ptX, len + nLen);
            len += nLen;

            ctx.current.strokeStyle = "#58C4DD";
            nLen = drawAltitude(2);
            ctx.current.lineWidth = barWidth;
            drawLine(ptX, len, ptX, len + nLen);

            // Draw the point
            ctx.current.fillStyle = "white";
            ctx.current.beginPath();
            ctx.current.arc(pt.x * scl.height, pt.y * scl.height, 5, 0, 2 * Math.PI);
            ctx.current.fill();
        }

        // Draw the top line
        ctx.current.strokeStyle = "white";
        ctx.current.lineWidth = 1;
        drawLine(-100, rt3_over_2, 100, rt3_over_2);

        // Draw the triangle
        ctx.current.lineWidth = 3;
        ctx.current.beginPath();
        for (let i = 0; i < 3; i ++) {
            ctx.current.lineTo(verts[i].x * scl.height, verts[i].y * scl.height);
        }
        ctx.current.closePath();
        ctx.current.stroke();
    }, [drawAltitude]);

    /*
    Mouse handlers.
    */
   
    const onDrag = useCallback((mouseX, mouseY) => {
        if (!dragging) return;

        // Remap to screen
        let scl = sclInfo.current;
        let pt = vec2(mouseX - scl.hW, scl.height - mouseY).div(scl.height);

        // Redraw
        if (testPointInTri(pt)) {
            pos.current = pt;
            redrawScene();
        } else {
            setDragging(false);
        }
    }, [dragging, redrawScene]);

    /*
    Handle resizing.
    */

    const transformCanvas = useCallback(() => {
        // Sets the canvas transform
        ctx.current.resetTransform();
        ctx.current.translate(sclInfo.current.hW, sclInfo.current.height);
        ctx.current.scale(1, -1);
    }, []);

    const onResize = useCallback((scl) => {
        // Set sizing
        if (scl.isMobile) return;
        sclInfo.current = scl;

        // Redraw scene
        if (ctx.current) {
            transformCanvas();
            redrawScene();
        }
    }, [transformCanvas, redrawScene]);

    /*
    Initialize.
    */

    const initialize = useCallback(() => {
        // Initialize canvas
        ctx.current = canvasRef.current.getContext("2d");

        transformCanvas();
        redrawScene();
    }, [transformCanvas, redrawScene]);

    return (<>
        <title>Viviani&apos;s theorem | Zenzicubic</title>
        <CanvasDemo title="Viviani&apos;s theorem" canvasRef={canvasRef} onInitialize={initialize} 
            onResize={onResize} onInteractionStart={() => setDragging(true)}
            onInteractionMove={onDrag} onInteractionEnd={() => setDragging(false) }>
                <p>
                    This is a demonstration of <a href="https://youtu.be/PQbAG1tYpAs" target="_blank" rel="noopener noreferrer">Viviani&apos;s theorem</a>, which states that for any point inside an equilateral triangle, the sum of the lengths of its altitudes is the height of the triangle. Click and drag inside the triangle to move the point.
                </p>
        </CanvasDemo>    
    </>);
}

export default VivianiThmDemo;