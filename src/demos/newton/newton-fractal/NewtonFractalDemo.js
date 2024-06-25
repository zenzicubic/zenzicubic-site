/**
 * This is the Newton fractal demo.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
*/

import React from 'react';
import { useCallback, useRef } from 'react';
import { Vector2 } from 'three';
import { MathJax } from 'better-react-mathjax';
import { Select } from 'antd';

import NewtonTemplateDemo from '../NewtonTemplateDemo';
import Slider from '../../../components/slider/Slider';
import Accordion from '../../../components/accordion/Accordion';
import NumericInput from '../../../components/numeric-input/NumericInput';

// Constants
const alphaRange = 2;
const NCOEFFS = 11;

// List of coloring methods
const colorModes = [
    {label: "Color by argument/iteration", value: 0},
    {label: "Color by argument only", value: 1},
    {label: "Brightness by iteration", value: 2},
    {label: "Color by iteration", value: 3}
];

function NewtonFractalDemo() {
    const demoRef = useRef(null);

    // Parameters
    const colorMode = useRef(0);
    const coeffs = useRef([-1,0,0,1,0,0,1,0,0,0,0]);
    const alpha = useRef(new Vector2(1, 0));

    /*
    Downloads an image of the fractal.
    */

    const saveImg = useCallback(() => {
        let elt = document.createElement("a");
        elt.href = demoRef.current.getImageURL();
        elt.download = "newtonfractal.png";
        elt.click();
    }, []);

    // The menu itself
    return (
        <NewtonTemplateDemo title="Newton fractals" initialScl="1.5" zoomFac="0.99"
            ref={demoRef} shaderPath={require("./newton-fractal-shader.glsl")} 
            uniforms={[
                {name: "colorMode", value: colorMode.current},
                {name: "alpha", value: alpha.current},
                {name: "fun", value: coeffs.current}
            ]}>
            <p>
                This is an interactive visualization of <a href="https://en.wikipedia.org/wiki/Newton_fractal" target="_blank" rel="noopener noreferrer">generalized Newton fractals</a> for arbitrary polynomials of degree 10 or less with real coefficients. See the dropdowns for more.
            </p>

            <Accordion title="What are Newton fractals?">
                Newton&apos;s method is a method to find the zeros of a function <MathJax inline>{'\\(f(x)\\)'}</MathJax>. It entails iterating the map:

                <MathJax>{`\\(\\begin{align*}
                    x_{n+1}=x_n-\\frac{f(x_n)}{f^\\prime(x_n)}
                \\end{align*}\\)`}</MathJax>

                for some initial guess <MathJax inline>{'\\(x_0\\)'}</MathJax>. To generate the fractal, we iterate Newton&apos;s method some number of times, or until convergence, for each point in the complex plane. Then, we color the initial point based on the closest zero (or the argument in our case), by the number of iterations until convergence, or by a combination of the two. The result is a chaotic fractal pattern, known as a Newton fractal.<br /><br />

                For the generalized Newton fractal, we modify the Newton iteration slightly by adding a real or complex coefficient <MathJax inline>{'\\(\\alpha\\)'}</MathJax>:

                <MathJax>{`\\(\\begin{align*}a
                    x_{n+1}=x_n-\\alpha\\frac{f(x_n)}{f^\\prime(x_n)}
                \\end{align*}\\)`}</MathJax>
            </Accordion>

            <Accordion title="How do I use this?">
                Click and drag to move, and use the menu to zoom and reset. Enter the coefficients to the polynomial in the marked fields. Use the dropdown to select the coloring method, and the sliders to change the real and imaginary parts of <MathJax inline>{'\\(\\alpha\\)'}</MathJax>. Press <strong>Save image</strong> to save an image of your fractal.
            </Accordion>

            <hr />

            <p>Polynomial:</p>
            <span id="polynomial">
                <NumericInput defaultValue={coeffs.current[0]} 
                    name="coeff0" onChange={(val) => {
                        coeffs.current[0] = val; 
                    }} /> +&nbsp;

                <NumericInput defaultValue={coeffs.current[1]} 
                    name="coeff1" onChange={(val) => {
                        coeffs.current[1] = val; 
                    }} />
                <i>x</i> +&nbsp;

                {coeffs.current.slice(2).map((coeff, idx) => {
                    // Automatically add the terms with n >= 2
                    let j = idx + 2;
                    let symbol = (j < NCOEFFS - 1 ? " + " : "");

                    return (<span key={"term" + idx}>
                        <NumericInput defaultValue={coeff} 
                            name={"coeff" + j} onChange={(val) => {
                                coeffs.current[j] = val; 
                            }} />
                        <i>x</i><sup>{j}</sup>{symbol}
                    </span>)
                })}
            </span>

            <p>Coloring Method:</p>
            <Select 
                defaultValue={colorMode.current} options={colorModes}
                onChange={(val) => {
                    colorMode.current = val;
                    demoRef.current.setUniform("colorMode", val);
            }} /><br />

            <Slider min={-alphaRange} max={alphaRange} step="1e-2" value="1" 
                label={<MathJax inline>{'\\(\\text{Re } \\alpha\\)'}</MathJax>} 
                onChange={(val) => {
                    alpha.current.x = val;
            }}/>
            <Slider min={-alphaRange} max={alphaRange} step="1e-2" value="0" 
                label={<MathJax inline>{'\\(\\text{Im } \\alpha\\)'}</MathJax>} 
                onChange={(val) => {
                    alpha.current.y = val;
            }}/>

            <button onClick={saveImg}>
                <span className="material-icons">save</span> Save image
            </button>
        </NewtonTemplateDemo>
    )
}

export default NewtonFractalDemo;