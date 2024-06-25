/**
 * This is the Wittgenstein's rod demo. A lot of this is just the same as the 
 * pedal curve demo, because they are fairly similar.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

import React from 'react';
import { useRef, useCallback } from 'react';
import { MathJax } from 'better-react-mathjax';

import CurveDemo from './CurveDemo';
import Accordion from '../../components/accordion/Accordion';
import Slider from '../../components/slider/Slider';

import { versor, vec2 } from '../../math';
import { colors } from './CurveDemo';

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
        let curvePt = versor(t).scale(paras.r);
        let rayDir = fixPt.sub(curvePt).normalize();
        let tracePt = curvePt.add(rayDir.scale(paras.l));

        // Set geometry data
        return {curvePt, rayDir, tracePt};
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
        let curvePt = geom.curvePt;
        let endPt = curvePt.add(geom.rayDir.scale(1e3));

        // Draw ray
        ctx.strokeStyle = colors.yellow;
        ctx.beginPath();
        ctx.moveTo(curvePt.x, curvePt.y);
        ctx.lineTo(endPt.x, endPt.y)
        ctx.stroke();

        // Circle point
        ctx.fillStyle = colors.blue;
        markPt(curvePt);

        // Locus point
        ctx.fillStyle = colors.green;
        markPt(geom.tracePt);
    }, [markPt]);

    return (<>
        <title>Wittgenstein&apos;s rod | Zenzicubic</title>
        <CurveDemo title="Wittgenstein&apos;s rod" updateGeometryData={updateGeometryData}
            redrawScene={redrawScene} params={demoParams} ref={demoRef}>
                <p>This is an interactive demonstration of <a href="https://youtu.be/0R1_wU_aEVI" target="_blank" rel="noopener noreferrer">Wittgenstein&apos;s rod</a>.</p>
                <Accordion title="What is this?">
                    Wittgenstein&apos;s rod is a geometric puzzle first posed by philosopher Ludwig Wittgenstein. It goes: Consider a point <MathJax inline>{'\\(P\\)'}</MathJax> on some circle <MathJax inline>{'\\(\\mathcal{C}\\)'}</MathJax> with radius <MathJax inline>{'\\(r\\)'}</MathJax>. Then, mark another arbitrary point <MathJax inline>{'\\(Q\\)'}</MathJax>. Draw ray <MathJax inline>{'\\(PQ\\)'}</MathJax>, and mark point <MathJax inline>{'\\(R\\)'}</MathJax> on ray <MathJax inline>{'\\(PQ\\)'}</MathJax> so that <MathJax inline>{'\\(PR = \\ell\\)'}</MathJax> for some constant <MathJax inline>{'\\(\\ell\\)'}</MathJax>. What is the locus of <MathJax inline>{'\\(R\\)'}</MathJax>?
                </Accordion>
                <Accordion title="How do I use this?">
                    Drag the red point to change <MathJax inline>{'\\(Q\\)'}</MathJax>, and change the values of the sliders. Press <span className="material-icons small">play_arrow</span>/<span className="material-icons small">pause</span> to play or pause the demo.
                </Accordion>
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