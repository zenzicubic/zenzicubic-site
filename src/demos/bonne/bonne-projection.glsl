/*
This is the shader source for the Bonne projection demo.
This code is protected under the MIT license (see the LICENSE file).
Author: Zenzicubic
*/

// Uniforms and output
uniform sampler2D mapTex;
uniform mat3 rot;
uniform vec2 size;
uniform float scale;
uniform float phi1, cotPhi1;

out vec4 col;

// Constants
#define MAP_SCL 2.75
#define IMG_SZ 1024.

const float PI = 3.14159265359;
const float HALF_PI = 0.5 * PI;

void main(void) {
    // Get point on display
    vec2 z = MAP_SCL * (2. * gl_FragCoord.xy - size) / scale;
    z.y -= phi1;

    // Apply inverse Bonne projection
    float lambda, phi, rho;
    if (phi1 == 0.) {
        // Degenerate case of sinusoidal projection
        phi = z.y;
        lambda = z.x / cos(phi);
    } else {
        rho = distance(z, vec2(0., cotPhi1));
        phi = cotPhi1 + phi1 - rho;
        lambda = rho * atan(z.x, cotPhi1 - z.y) / cos(phi);
    }

    // Discard if outside range
    if (phi < -HALF_PI || phi > HALF_PI || lambda < -PI || lambda > PI) {
        col = vec4(.07, .07, .07, 1.);
        return;
    }

    // Remap into 3D space and rotate
    float cosPhi = cos(phi);
    vec3 spherePt = vec3(
        cosPhi * cos(lambda),
        cosPhi * sin(lambda),
        sin(phi));
    spherePt *= rot;

    // Remap back to 2D
    lambda = atan(spherePt.y, spherePt.x);
    phi = asin(spherePt.z);

    // Get texture sample with gamma correction
    vec2 pos = IMG_SZ * (vec2(lambda + PI, phi + HALF_PI) / PI);
    col = sqrt(texelFetch(mapTex, ivec2(pos), 0));
}