/**
 * This is the Wittgenstein's rod demo. A lot of this is just the same as the 
 * pedal curve demo, because they are fairly similar.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

import React from 'react';
import { useRef, useCallback } from 'react';
import { MathJax } from 'better-react-mathjax';

import CurveDemo, { colors } from './CurveDemo';
import Slider from '../../components/slider/Slider';
import { versor, vec2 } from '../../math';

// Assorted constants
const demoParams = {
    sclFac: 0.1,
    nSteps: 25,
    dt: 3.75e-4,
    ptSz: 0.1,
    ptPos: vec2(0.995, 0)
};

function WittgensteinRodDemo() {
    const demoRef = useRef(null);
    const params = useRef({r: 1, l: 2.5});

    /*
    Updating geometry data.
    */

    const updateGeometryData = useCallback((t, fixPt) => {
        let paras = params.current;

        // Compute point on locus
        let circPt = versor(t).scale(paras.r);
        let rayDir = fixPt.sub(circPt).normalize();
        let tracePt = circPt.add(rayDir.scale(paras.l));

        // Set geometry data
        return {circPt, rayDir, tracePt};
    }, []);

    /*
    Redrawing the scene and associated functions.
    */

    const markPt = useCallback((pt) => {
        // Draws a point on the canvas
        let ctx = demoRef.current.getContext();

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, demoParams.ptSz, 0, 2 * Math.PI);
        ctx.fill();
    }, []);

    const redrawScene = useCallback((geom) => {
        let ctx = demoRef.current.getContext();

        // Circle
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.arc(0, 0, params.current.r, 0, 2 * Math.PI);
        ctx.stroke();

        // Locus
        ctx.strokeStyle = colors.green;
        ctx.beginPath();
        for (let pt of demoRef.current.getPath()) {
            ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();

        // Get ray direction
        let circPt = geom.circPt;
        let endPt = circPt.add(geom.rayDir.scale(1000));

        // Draw ray
        ctx.strokeStyle = colors.yellow;
        ctx.beginPath();
        ctx.moveTo(circPt.x, circPt.y);
        ctx.lineTo(endPt.x, endPt.y)
        ctx.stroke();

        // Circle point
        ctx.fillStyle = colors.blue;
        markPt(circPt);

        // Locus point
        ctx.fillStyle = colors.green;
        markPt(geom.tracePt);
    }, [markPt]);

    return (<>
        <title>Wittgenstein&apos;s rod | Zenzicubic</title>
        <CurveDemo title="Wittgenstein&apos;s rod" updateGeometryData={updateGeometryData}
            redrawScene={redrawScene} params={demoParams} ref={demoRef}>
                <p>
                    This is a demonstration of <a href="https://youtu.be/0R1_wU_aEVI" target="_blank" rel="noopener noreferrer">Wittgenstein&apos;s rod</a>, a geometric puzzle posed by philosopher Ludwig Wittgenstein. It goes:<br /><br />

                    Consider a point <MathJax inline>{'\\(P\\)'}</MathJax> on some circle <MathJax inline>{'\\(C\\)'}</MathJax> with radius <MathJax inline>{'\\(r\\)'}</MathJax>. Then, mark another arbitrary point <MathJax inline>{'\\(Q\\)'}</MathJax>. Draw ray <MathJax inline>{'\\(PQ\\)'}</MathJax>, and mark point <MathJax inline>{'\\(R\\)'}</MathJax> on ray <MathJax inline>{'\\(PQ\\)'}</MathJax> so that <MathJax inline>{'\\(PR = \\ell\\)'}</MathJax> for some constant <MathJax inline>{'\\(\\ell\\)'}</MathJax>. What is the locus of <MathJax inline>{'\\(R\\)'}</MathJax>?<br /><br />

                    Drag the red point to change <MathJax inline>{'\\(Q\\)'}</MathJax>, and change the values of the sliders. Press <strong>Play/Pause</strong> to play or pause the demo.
                </p>
                <hr />
                <Slider min={0.5} max={2.5} step={1e-2} value={params.current.r} 
                    label={<MathJax inline>{'\\(r\\)'}</MathJax>} onChange={(r) => {
                        params.current.r = r;
                        demoRef.current.paramsUpdated();
                }}/>
                <Slider min={0.5} max={5} step={1e-2} value={params.current.l}
                    label={<MathJax inline>{'\\(\\ell\\)'}</MathJax>} onChange={(l) => {
                        params.current.l = l;
                        demoRef.current.paramsUpdated();
                }} />
        </CurveDemo>
    </>);
}

export default WittgensteinRodDemo;