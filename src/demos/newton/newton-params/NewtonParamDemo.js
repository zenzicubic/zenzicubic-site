/**
 * This is the Newton parameter demo.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
*/

import React from 'react';

import NewtonTemplateDemo from '../NewtonTemplateDemo';

function NewtonParamDemo() {
    return (
        <NewtonTemplateDemo title="Newton parameter space" initialScl="2.5" zoomFac="0.99"
            shaderPath={require("./newton-param-shader.glsl")}>
            <p>
                This is a visualization of the parameter space of cubic Newton fractals, inspired by <a href="https://www.youtube.com/watch?v=LqbZpur38nw" target="_blank" rel="noopener noreferrer">this 3Blue1Brown video</a>. If you zoom in a bit, you might see a familiar shape. Click and drag to move, and use the buttons to zoom in, zoom out, and reset.
            </p>
        </NewtonTemplateDemo>
    )
}

export default NewtonParamDemo;