/**
 * This is the Wittgenstein's rod demo.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

import React from 'react';
import { useRef, useCallback } from 'react';
import { MathJax } from 'better-react-mathjax';
import { Select } from 'antd';

import Accordion from '../../components/accordion/Accordion';
import CurveDemo from './CurveDemo';
import { vec2, sqr, versor } from '../../math';
import { colors } from './CurveDemo';

// Assorted constants
const dotSz = 1e-2;
const demoParams = {
    sclFac: 0.15,
    nSteps: 4,
    dt: 3e-3,
    ptSz: 0.075,
    ptPos: vec2(0, 0)
};

// Curves (and derivatives)
const hyperbolaIdx = 6;
const parabolaHelper = (t) => 1 / (1 - Math.sin(t));

const curves = [
    { // Circle
        fn: versor,
        deriv: (t) => vec2(-Math.sin(t), Math.cos(t))
    },
    { // 2:1 ellipse
        fn: (t) => vec2(2 * Math.cos(t), Math.sin(t)),
        deriv: (t) => vec2(-2 * Math.sin(t), Math.cos(t))
    },
    { // Cardioid
        fn: (t) => vec2(
            Math.cos(t) + 0.5 * Math.cos(2 * t),
	        Math.sin(t) + 0.5 * Math.sin(2 * t)),
        deriv: (t) => vec2(
            -(Math.sin(t) + Math.sin(2 * t)),
            Math.cos(t) + Math.cos(2 * t))
    },
    { // Deltoid
        fn: (t) => vec2(
            Math.cos(t) + 0.5 * Math.cos(2 * t),
            Math.sin(t) - 0.5 * Math.sin(2 * t)),
        deriv: (t) => vec2(
            -(Math.sin(t) + Math.sin(2 * t)),
            Math.cos(t) - Math.cos(2 * t))
    },
    { // Astroid
        fn: (t) => vec2(
            1.5 * Math.cos(t) + 0.5 * Math.cos(3 * t),
            1.5 * Math.sin(t) - 0.5 * Math.sin(3 * t)),
        deriv: (t) => vec2(
            -1.5 * (Math.sin(t) + Math.sin(3 * t)),
            1.5 * (Math.cos(t) - Math.cos(3 * t)))
    },
    { // Parabola
        fn: (t) => vec2(Math.cos(t), -Math.sin(t)).scale(parabolaHelper(t)),
        deriv: (t) => {
            let hlp = parabolaHelper(t);
            return vec2(hlp, -Math.cos(t) * hlp * hlp);
        }
    },
    { // Hyperbola
        fn: (t) => vec2(
            -1 / Math.cos(t),
            Math.tan(t)),
        deriv: (t) => {
            let sec = 1 / Math.cos(t);
            return vec2(-Math.tan(t) * sec, sec * sec);
        }
    },
    { // Maltese cross
        fn: (t) => {
            let cossin = versor(t);
            return vec2(
                2 * cossin.x * (sqr(cossin.x) - 2),
                2 * cossin.y * sqr(cossin.x));
        },
        deriv: (t) => {
            let cossin = versor(t);
            return vec2(
                -2 * (cossin.y * (sqr(cossin.x) - 2) + Math.sin(2 * t) * cossin.x),
                -4 * cossin.x + 6 * Math.pow(cossin.x, 3));
        }
    }
];

// Names of curves
const curveNames = [
    {label: "Circle", value: 0},
    {label: "Ellipse", value: 1},
    {label: "Cardioid", value: 2},
    {label: "Deltoid", value: 3},
    {label: "Astroid", value: 4},
    {label: "Parabola", value: 5},
    {label: "Hyperbola", value: 6},
    {label: "Maltese cross", value: 7}
];

/*
The actual component.
*/

function PedalDemo() {
    const demoRef = useRef(null);
    const selIdx = useRef(7);

    /*
    Computing points on the curve.
    */
   
    const updateGeometryData = useCallback((t, pedalPt) => {
        // Compute point and tangent to curve
        let selCurve = curves[selIdx.current];
        let curvePt = selCurve.fn(t);
        let tgVec = selCurve.deriv(t);

        // Compute slopes and pedal point
        let m = tgVec.y / tgVec.x;
        let px = 
            (pedalPt.x * sqr(tgVec.x) + curvePt.x * sqr(tgVec.y) + 
            (pedalPt.y - curvePt.y) * tgVec.x * tgVec.y) / tgVec.normSq();
        let py = (-1 / m) * (px - pedalPt.x) + pedalPt.y;
        
        // Set geometry data
        return {
            tgSlope: m,
            tracePt: vec2(px, py),
            curvePt, tgVec
        };
    }, []);

    /*
    Redrawing the scene and associated functions.
    */
    
    const plotParametric = useCallback((eqn, t0, t1, closePath) => {
        // Plots a parametric curve
        let ctx = demoRef.current.getContext();
        let pt;
        ctx.beginPath();
        for (let t = t0; t < t1; t += 1e-3) {
            pt = eqn(t);
            ctx.lineTo(pt.x, pt.y);
        }
        if (closePath) {
            ctx.closePath();
        }
        ctx.stroke();
    }, []);

    const markPt = useCallback((pt) => {
        // Draws a point on the canvas
        let ctx = demoRef.current.getContext();

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, demoParams.ptSz, 0, 2 * Math.PI);
        ctx.fill();
    }, []);

    const linePtSlope = useCallback((pt, m) => {
        // Draws a line from its point-slope form
        let ctx = demoRef.current.getContext();

        ctx.beginPath();
        ctx.moveTo(-10, m * (-10 - pt.x) + pt.y);
        ctx.lineTo(10, m * (10 - pt.x) + pt.y);
        ctx.stroke();
    }, []);

    const redrawScene = useCallback((geom) => {
        // Plot curve
        let selCurve = curves[selIdx.current];
        let ctx = demoRef.current.getContext();
        ctx.strokeStyle = "white";

        if (selIdx.current === hyperbolaIdx) {
            // We have to plot the hyperbola as two separate branches
            plotParametric((t) => vec2(Math.cosh(t), Math.sinh(t)), -10, 10, false);
            plotParametric((t) => vec2(-Math.cosh(t), Math.sinh(t)), -10, 10, false);
        } else {
            plotParametric(selCurve.fn, 0, 2 * Math.PI, true);
        }

        // Draw pedal curve
        ctx.fillStyle = colors.green;
        for (let pt of demoRef.current.getPath()) {
            ctx.fillRect(pt.x, pt.y, dotSz, dotSz);
        }

        // Draw geometric construction
        let m = geom.tgSlope;

        ctx.strokeStyle = colors.yellow;
        linePtSlope(geom.curvePt, m);
        ctx.strokeStyle = colors.blue;
        linePtSlope(geom.tracePt, -1 / m);

        ctx.fillStyle = colors.yellow;
        markPt(geom.curvePt);
        ctx.fillStyle = colors.green;
        markPt(geom.tracePt);
    }, [plotParametric, markPt, linePtSlope]);

    return (<>
        <title>Pedal curves | Zenzicubic</title>
        <CurveDemo title="Pedal curves" updateGeometryData={updateGeometryData}
            redrawScene={redrawScene} params={demoParams} ref={demoRef}>
            <p>
                This is a demonstration of <a href="https://youtu.be/ejtqjxGvhL0" target="_blank" rel="noopener noreferrer">pedal curves</a>.</p>
                
            <Accordion title="What are pedal curves?">
                Pedal curves are plane curves produced from other plane curves by the following construction:<br /><br />

                Mark a point <MathJax inline>{'\\(P\\)'}</MathJax> on some curve <MathJax inline>{'\\(\\mathcal{C}\\)'}</MathJax>, and construct the tangent at that point. Mark another point <MathJax inline>{'\\(O\\)'}</MathJax> called the pedal point, and draw the line perpendicular to the tangent through it. The locus of the intersection of those two lines, which we'll call <MathJax inline>{'\\(\\mathcal{I}\\)'}</MathJax>, is the pedal curve of <MathJax inline>{'\\(\\mathcal{C}\\)'}</MathJax>.
            </Accordion>
            <Accordion title="How do I use this?">
                Click and drag the red pedal point, and use the dropdown to choose a curve. Press <span className="material-icons small">play_arrow</span>/<span className="material-icons small">pause</span> to play or pause the animation.
            </Accordion>
            <hr />
            <p>Curve:</p>
            <Select 
                defaultValue={selIdx.current} options={curveNames}
                onChange={(val) => {
                    selIdx.current = val;
                    demoRef.current.paramsUpdated();
                }} /><br />
        </CurveDemo>
    </>);
}

export default PedalDemo;