/**
 * This is the Dandelin sphere demo.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

import React from 'react';
import { useRef, useEffect, useCallback } from 'react';

import Accordion from '../../components/accordion/Accordion';
import Engine3D from '../../threedengine/threedengine';
import Slider from '../../components/slider/Slider';

import { Point, Segment } from '../../threedengine/threedengine';
import { vec3 } from '../../threedengine/threedmath';
import { Demo } from '../../components/demos/demos';

/*
Constants and utility functions.
*/
const cylOpacity = 0.2, sphereOpacity = 0.4;
const curveThickness = 2, ptRad = 8;

const nLines = 11, curveRes = 70;
const plnSize = 2.5, cylHeight = 3;

// Colors
const ellipseCol = "yellow", circleCol = "#FC6255";
const segCol1 = "#83C167", segCol2 = "#58C4DD";

const getPointOnSphere = (theta, phi, cen) => {
    // Get a point on a sphere of radius 1 centered at cen
    let sinTheta = Math.sin(theta);
    return vec3(
        sinTheta * Math.cos(phi),
        Math.cos(theta),
        sinTheta * Math.sin(phi)
    ).add(cen);
}

/*
The actual demo.
*/
function DandelinDemo() {
    // DOM elements
    const canvasRef = useRef(null);
    const iconRef = useRef(null);
    const engine = useRef(null);

    // Parameters and geometry data
    const plnAng = useRef(Math.PI * (40 / 180));
    const geomDat = useRef({});

    /*
    Getting a point on the ellipse.
    */

    const getEllipsePt = useCallback((t) => {
        // Gets a point on the ellipse for a given parameter
        let { axes, majRad } = geomDat.current;
        
        return axes[1].mul(Math.cos(t))
          .add(axes[2].mul(Math.sin(t) * majRad));
    }, []);

    /*
    Building the various objects in the scene.
    */

    const makeCircle = useCallback((cen, col, opacity, thickness) => {
        // Makes a circle lying in the XZ-plane with given properties
        let mesh = [];
        let lastPt = cen.add(vec3(1, 0, 0));

        let t, pt;
        for (let i = 1; i <= curveRes; i ++) {
            t = 2 * Math.PI * (i / curveRes);
            pt = vec3(Math.cos(t), 0, Math.sin(t)).add(cen);

            mesh.push(new Segment(lastPt, pt, col, opacity, thickness));
            lastPt = pt;
        }
        return mesh;
    }, []);

    const buildCylinder = useCallback(() => {
        // Build the cylinder that encloses the construction
        let u, cos, sin;

        // First, create the circles
        let cylinder = [
            ...makeCircle(vec3(0, cylHeight, 0), "white", cylOpacity, 1),
            ...makeCircle(vec3(0, -cylHeight, 0), "white", cylOpacity, 1)];

        // Then, create the vertical lines
        for (let i = 0; i < nLines; i ++) {
            u = 2 * Math.PI * (i / nLines);
            cos = Math.cos(u);
            sin = Math.sin(u);

            cylinder.push(new Segment(
                vec3(cos, cylHeight, sin),
                vec3(cos, -cylHeight, sin),
                "white", cylOpacity));
        }
        engine.current.objects[0] = cylinder;
    }, [makeCircle]);

    const makeSphere = useCallback((cen, idx) => {
        // Builds a sphere of radius 1 with given center
        let i, j, u, v, lastPt, pt;
        let sphereMesh = [];

        // Make the lines of latitude
        for (i = 0; i < nLines; i ++) {
            v = 2 * Math.PI * i / nLines;
            lastPt = getPointOnSphere(0, v, cen);

            // Build each circle
            for (j = 1; j <= curveRes; j ++) {
                u = Math.PI * j / curveRes;
                pt = getPointOnSphere(u, v, cen);

                sphereMesh.push(new Segment(lastPt, pt, "white", sphereOpacity));
                lastPt = pt;
            }
        }

        // Make the lines of longitude
        for (i = 0; i < nLines; i ++) {
            u = Math.PI * i / nLines;
            lastPt = getPointOnSphere(u, 0, cen);

            // Build each circle
            for (j = 1; j <= curveRes; j ++) {
                v = 2 * Math.PI * (j % curveRes) / curveRes;
                pt = getPointOnSphere(u, v, cen);
                
                sphereMesh.push(new Segment(lastPt, pt, "white", sphereOpacity));
                lastPt = pt;
            }
        }

        engine.current.objects[idx] = sphereMesh;
    }, []);

    const updateLines = useCallback((t) => {
        // Compute points on circles and ellipse
        let { majRad, foci } = geomDat.current;
        let pos = getEllipsePt(t);

        let cos = Math.cos(t), sin = Math.sin(t);
        let p0 = vec3(cos, majRad, sin);
        let p1 = vec3(cos, -majRad, sin);
        
        // Set segments
        engine.current.objects[7] = [
            new Segment(p0, pos, segCol2, 1, curveThickness),
            new Segment(pos, p1, segCol1, 1, curveThickness),
            new Segment(pos, foci[0], segCol1, 1, curveThickness),
            new Segment(pos, foci[1], segCol2, 1, curveThickness),
        ];
    }, [getEllipsePt]);

    /*
    Computing the geometry data and updating geometry.
    */

    const updateGeom = useCallback(() => {
        let alpha = plnAng.current;
        
        // Compute basis vectors
        let cos = Math.cos(alpha);
        let sin = Math.sin(alpha);

        let axes = [
            vec3(0, cos, sin),
            vec3(1, 0, 0),
            vec3(0, -sin, cos)];
        geomDat.current.axes = axes;

        // Compute major radius and focal distance, etc
        let majRad = 1 / Math.cos(alpha);
        let focalDis = Math.sqrt(majRad * majRad - 1);

        geomDat.current.majRad = majRad;
        geomDat.current.focalDis = focalDis;

        // Compute foci
        let focus = axes[2].mul(focalDis);
        let foci = [focus, focus.neg()];
        geomDat.current.foci = foci;

        // Build spheres and circles
        makeSphere(vec3(0, majRad, 0), 1);
        makeSphere(vec3(0, -majRad, 0), 2);
        engine.current.objects[3] = makeCircle(vec3(0, majRad, 0), circleCol, 1, curveThickness);
        engine.current.objects[4] = makeCircle(vec3(0, -majRad, 0), circleCol, 1, curveThickness);

        // Build plane
        let pt0 = axes[1].add(axes[2]).mul(plnSize);
        let pt3 = axes[1].sub(axes[2]).mul(plnSize);
        let pt1 = axes[1].neg().add(axes[2]).mul(plnSize);
        let pt2 = axes[1].neg().sub(axes[2]).mul(plnSize);

        engine.current.objects[5] = [
            new Segment(pt0, pt1),
            new Segment(pt1, pt2),
            new Segment(pt2, pt3),
            new Segment(pt3, pt0)];

        // Build ellipse
        let ellipseMesh = [];
        let lastPt = getEllipsePt(0);

        let t, pt;
        for (let i = 1; i <= curveRes; i ++) {
            t = 2 * Math.PI * (i / curveRes);
            pt = getEllipsePt(t);

            ellipseMesh.push(new Segment(
                lastPt, pt, ellipseCol,
                1, curveThickness));
            lastPt = pt;
        }

        // Add foci to ellipse mesh
        ellipseMesh.push(new Point(foci[0], segCol1, ptRad));
        ellipseMesh.push(new Point(foci[1], segCol2, ptRad));

        engine.current.objects[6] = ellipseMesh;
    }, [makeSphere, makeCircle, getEllipsePt]);

    /* 
    Play/pause button.
    */

    const setPlayState = useCallback(() => {
        // Play/pause the animation frame
        let running = !engine.current.isRunning;
        if (running) {
            iconRef.current.innerHTML = "pause";
        } else {
            iconRef.current.innerHTML = "play_arrow";
        }
        engine.current.isRunning = running;
    }, []);

    /*
    Initialization.
    */

    useEffect(() => {
        engine.current = new Engine3D(canvasRef.current, updateLines);
        buildCylinder();
        updateGeom();

        return () => {
            engine.current.dispose();
        }
    }, [buildCylinder, updateGeom, updateLines]);

    return (<>
        <title>Dandelin spheres | Zenzicubic</title>
        <Demo title="Dandelin spheres">
            <p>This is a demo of a modification of the <a href="https://en.wikipedia.org/wiki/Dandelin_spheres" target="_blank" rel="noopener noreferrer">Dandelin spheres</a>, a set of special spheres that provide a beautiful proof of the equivalence of two famous methods of constructing ellipses.</p>

            <Accordion title="What is this?">
                There are many methods to construct ellipses, but two of the most famous are cutting a cylinder by a plane and the <a href="https://en.wikipedia.org/wiki/Ellipse#Pins-and-string_method" target="_blank" rel="noopener noreferrer">pins-and-string method</a>. Essentially, if we draw two spheres (the Dandelin spheres) tangent to both the cylinder and the cutting plane at one of the foci, we can look at the relationships between the segments connecting points on circles of tangency to a point on the ellipse and the segments connecting the foci to that same point to prove the equivalence of these two methods. Congruent segments have the same color here. This technique is usually done with a cone rather than a cylinder, but I&apos;ve used a simpler version as described on pg. 7 of the book <i>Geometry and the Imagination</i> by David Hilbert and Stefan Cohn-Vossen.
            </Accordion>
            <Accordion title="How do I use this?">
                Click or tap and drag to rotate. Use the slider to change the cutting plane angle. Press the <span className="material-icons small">play_arrow</span>/<span className="material-icons small">pause</span> button to play or pause the animation.
            </Accordion>
            <hr />

            <Slider label="Cutting plane angle" min="10" max="65" value="40" onChange={(val) => {
                plnAng.current = Math.PI * (val / 180);
                updateGeom();
            }} formatFn={(x) => x + "\u00B0"}/>
            
            <button onClick={setPlayState}>
                <span className="material-icons" ref={iconRef}>pause</span>
            </button>
        </Demo>
        <canvas className="demo-canvas" ref={canvasRef}></canvas>
    </>);
}

export default DandelinDemo;