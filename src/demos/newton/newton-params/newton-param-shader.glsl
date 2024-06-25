/*
This is the shader source for the Newton parameter space demo.
This code is protected under the MIT license (see the LICENSE file).
Author: Zenzicubic
*/

// Uniforms and output

uniform vec2 cen;
uniform vec2 size;
uniform float scale, dispScl;

out vec4 col;

// Constants
#define ONE vec2(1., 0.)
#define EPS 1e-5
#define MAXIT 150

// Colors and roots
vec3[3] cols = vec3[](
    vec3(0.557,0.267,0.678),
    vec3(0.204,0.596,0.859),
    vec3(0.18,0.8,0.443));
vec2[3] roots = vec2[](ONE, -ONE, vec2(0.));

// Complex math
vec2 cmul(vec2 a, vec2 b) { return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x); }
vec2 cinv(vec2 z) { return vec2(z.x, -z.y) / dot(z, z); }
vec2 cdiv(vec2 a, vec2 b) { return cmul(a, cinv(b)); }

vec2 iterate(vec2 z) {
	// Apply the Newton iteration for factored polynomial
    vec2 A = z - roots[0];
    vec2 B = z - roots[1];
    vec2 C = z - roots[2];
    
    return cdiv(
        cmul(A, cmul(B, C)),
        cmul(B, C) + cmul(A, C) + cmul(A, B));
}

vec3 test(vec2 z) {
	// Repeatedly apply the Newton iteration to the centroid of the roots and color accordingly
    roots[2] = z;
    
    vec2 L = (roots[0] + roots[1] + z) / 3.;
    float k;
    for (int i = 0; i < MAXIT; i ++) {
        L -= iterate(L);
        for (int j = 0; j < 3; j ++) {
            if (length(L - roots[j]) < EPS) {
            	k = 1. - (float(i) / float(MAXIT));
                return k * cols[j];
            }
        }
    }
    return vec3(0.);
}

void main(void) {
	// Get the coordinatess
    vec2 u = (2. * gl_FragCoord.xy - size) / scale;
    vec2 z = dispScl * u - cen;

    col = vec4(test(z), 1.);
}