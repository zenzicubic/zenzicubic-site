/*
This is the shader source for the Newton fractal demo.
This code is protected under the MIT license (see the LICENSE file).
Author: Zenzicubic
*/

// Constants
#define NCOEFFS 11
#define MAXITER 100
#define FAC .05

#define EPSILON 1e-3
#define PI 3.14159265359
#define ONE vec2(1., 0.)
#define ZERO vec2(0.)

out vec4 outputCol;

// Render params (size, scale, center)
uniform vec2 cen;
uniform vec2 size;
uniform float scale, dispScl;

// Fractal params
uniform int colorMode;
uniform vec2 alpha;
uniform float[NCOEFFS] fun;

// Complex number utilities
vec2 cmul(vec2 a, vec2 b) { return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x); }
vec2 cinv(vec2 z) { return vec2(z.x, -z.y) / dot(z, z); }
vec2 cdiv(vec2 a, vec2 b) { return cmul(a, cinv(b)); }

vec2 newtonIteration(vec2 z) {
    // Computes a single Newton fractal iteration
    vec2 zn = ONE;
    vec2 n = ZERO, d = ZERO;

    for (int i = 0; i < NCOEFFS - 1; i ++) {
        n += fun[i] * zn;
        d += float(i + 1) * fun[i + 1] * zn;
        zn = cmul(zn, z);
    }

    n += zn * fun[NCOEFFS - 1];
    return z - cmul(alpha, cdiv(n, d));
}

vec3 hsvToRgb(float h, float s, float v) {
    // Converts HSV colors to RGB
    h /= 60.;
    float k0 = mod(5. + h, 6.);
    float k1 = mod(3. + h, 6.);
    float k2 = mod(1. + h, 6.);
    return v - v * s * vec3(
        clamp(min(4. - k0, k0), 0., 1.),
        clamp(min(4. - k1, k1), 0., 1.),
        clamp(min(4. - k2, k2), 0., 1.)
    );
}

vec3 getCol(vec2 dispPos) {
    // Map the coordinates to the screen
	vec2 u = (2. * dispPos - size) / scale;
	vec2 z = dispScl * u - cen;

    // Apply Newton iteration and get color
    vec2 lastZ;
	int j = 0;

    while (j < MAXITER) { 
        lastZ = z;
		z = newtonIteration(z);
		
        // If approaching a fixed point, break
		if (length(z - lastZ) <= EPSILON) {
			break;
		} 
        j ++;
    }

    // Get various color maps
    float ang = 180. * (2. - atan(z.y, z.x) / PI);
    float iter = float(j) / float(MAXITER);
    if (colorMode == 0) {
        // Color by argument and iteration
        return hsvToRgb(ang, 1., 1. - iter);
    } else if (colorMode == 1) {
        // Color by argument only
        return hsvToRgb(ang, 1., 1.);
    } else if (colorMode == 2) {
        // Brightness by iteration
        return vec3(iter); 
    } else {
        // Colormap by iteration
        float t = float(j) * FAC;
		return .5 + .5 * cos(2. * PI * (t + vec3(.0, .1, .2)));
    }
}

void main(void) {
    vec2 pt = gl_FragCoord.xy;
	outputCol = vec4(getCol(pt), 1.0);
}