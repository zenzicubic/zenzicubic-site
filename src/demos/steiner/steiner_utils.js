/**
 * These are some utilities for the Steiner porism demo: Moebius 
 * transformations and circles.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

// Generic Moebius transformation class.
export class MoebiusTransformation {
    /**
     * Creates a new Moebius transformation.
     * @param {Complex} a First coefficient.
     * @param {Complex} b Second coefficient.
     * @param {Complex} c Third coefficient.
     * @param {Complex} d Fourth coefficient.
     */
    constructor(a, b, c, d) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
    }

    transform(z) {
        // Transforms a given point
        let num = this.a.mul(z).add(this.b);
        let den = this.c.mul(z).add(this.d);
        return num.div(den);
    }
}

// Generic circle class.
export class Circle {
    /**
     * Creates a new circle.
     * @param {Complex} cen Center.
     * @param {Number} rad Radius.
     */
    constructor(cen, rad) {
        this.cen = cen;
        this.rad = rad;
    }
}