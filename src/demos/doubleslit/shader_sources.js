/**
 * This is the source code for the various shaders used in the double-slit demo.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

export const shaderSources = {
    common: `
    uniform vec2 res;
    uniform sampler2D heightField;
    uniform float holeY, holeSize, scale;

    out vec4 pixVal;

    #define THICKNESS 0.025

    /*
    Utility functions.
    */

    vec2 mapToDisp(vec2 p) {
        // Maps a point to screen coordinates
        return (2. * p - res) / scale;
    }
    
    bool inEmitter(vec2 p) {
        // Test if a given point lies on the emitter
        p = mapToDisp(p);
        vec2 prj = vec2(-.5, clamp(p.y, -.5, .5));
        return (distance(p, prj) < THICKNESS);
    }

    bool onBoundary(vec2 p) {
        // Test if a given point lies on the divider
        p = abs(mapToDisp(p));
        return p.x < THICKNESS && (
               p.y <= holeY - holeSize ||
               p.y >= holeY + holeSize);
    }

    vec2 getValue(vec2 p) {
        // Gets the height field value at a given pixel
        if (onBoundary(p)) return vec2(0.);
        return texelFetch(heightField, ivec2(p), 0).xy;
    }`,
    backbuffer: `
    uniform float frequency, dissipation, time;

    #define dt 0.15

    float laplace(vec2 p) {
        // Laplacian using 9-point stencil
        float lap = -getValue(p).x;
    
        lap += 0.2 * getValue(p + vec2(0., -1.)).x;
        lap += 0.2 * getValue(p + vec2(0., 1.)).x;
        lap += 0.2 * getValue(p + vec2(-1., 0.)).x;
        lap += 0.2 * getValue(p + vec2(1., 0.)).x;
        lap += 0.05 * getValue(p + vec2(1., -1.)).x;
        lap += 0.05 * getValue(p + vec2(1., 1.)).x;
        lap += 0.05 * getValue(p + vec2(-1., 1.)).x;
        lap += 0.05 * getValue(p + vec2(-1., -1.)).x;
        return lap;
    }

    void main(void) {
        // Get display coordinates
        vec2 pt = gl_FragCoord.xy;

        if (inEmitter(pt)) {
            // Return emitter value
            pixVal = vec4(2. * sin(frequency * time));
        } else {
            // Integrate equation using Verlet integration
            vec2 state = getValue(pt);
            float vel = (state.x - state.y) / dt;
            float acc = laplace(pt) - dissipation * vel;
    
            pixVal = vec4(
                2. * state.x - state.y + dt * dt * acc, 
                state.x, 0., 0.);
        }
    }`,
    display: `
    void main(void) {
        // Get display coordinates
        vec2 pt = gl_FragCoord.xy;

        if (inEmitter(pt)) {
            pixVal = vec4(1., 1., 1., 1.);
        } else if (onBoundary(pt)) {
            pixVal = vec4(.3, .3, .3, 1.);
        } else {
            // Color based on wave height
            float t = clamp(getValue(pt).x + 1., 0., 2.);
            pixVal = vec4(
                .3 + t * (.55 * t - .75),
                .3 + t * (.40 * t - .6),
                1. + t * (.55 * t - 1.45),
                1.);
        }
    }`
};