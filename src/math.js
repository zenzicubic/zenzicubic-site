/**
 * This is just a bunch of generic math utilities for use in demos and applets.
 * It has support for 2D vectors, complex numbers, and some odds and ends.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

// Basic 2D vector class
export class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    // Sum and difference
    add = (v) => new Vector(this.x + v.x, this.y + v.y);

    sub = (v) => new Vector(this.x - v.x, this.y - v.y);

    // Scalar multiplication/divisions
    scale = (s) => new Vector(this.x * s, this.y * s);

    div = (s) => this.scale(1 / s);

    normSq = () => this.dot(this); // Squared norm of a vector

    norm = () => Math.sqrt(this.normSq()); // Norm (length) of a vector

    normalize = () => this.div(this.norm()); // Normalize a vector

    perp = () => new Vector(-this.y, this.x); // Perpendicular vector

    distance = (v) => this.sub(v).norm(); // Distance between two vectors

    dot = (v) => this.x * v.x + this.y * v.y; // Dot product

    cross = (v) => this.x * v.y - this.y * v.x; // Scalar cross product

    clone = () => new Vector(this.x, this.y); // Shallow copy
}

export const vec2 = (x, y) => new Vector(x, y); // GLSL-style alternative constructor
export const versor = (t) => vec2(Math.cos(t), Math.sin(t)); // Unit vector with given angle

// 2D vector constants
Vector.ZERO = vec2(0, 0);
Vector.UP = vec2(0, 1);
Vector.DOWN = vec2(0, -1);
Vector.LEFT = vec2(-1, 0);
Vector.RIGHT = vec2(1, 0);

/*
Complex number math.
*/

export class Complex {
    /**
     * Creates a new complex number. 
     * @param {Number} x Real part.
     * @param {Number} y Imaginary part.
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    // Adds two complex numbers
    add = (z) => new Complex(this.x + z.x, this.y + z.y);

    // Subtracts two complex numbers
    sub = (z) => new Complex(this.x - z.x, this.y - z.y);

    // Complex-complex multiplication
    mul = (z) => new Complex(this.x * z.x - this.y * z.y, this.x * z.y + this.y * z.x);

    // Complex number-real number multiplication
    mulRe = (k) => new Complex(this.x * k, this.y * k);

    // Complex-complex division
    div = (z) => this.mul(z.inv());

    // Complex number-real number division
    divRe = (k) => this.mulRe(1 / k);

    pow = (n) => {
        // Complex number-real number exponentiation
        let len = this.mag() ** n;
        let arg = this.arg() * n;
        return cis(arg).mulRe(len);
    }

    // Complex conjugate
    conj = () => new Complex(this.x, -this.y);

    // Negation
    neg = () => this.mulRe(-1);

    // i times the current complex number
    itimes = () => new Complex(-this.y, this.x);

    // Squared magnitude
    magSq = () => this.x * this.x + this.y * this.y;

    // Magnitude
    mag = () => Math.sqrt(this.magSq());

    // Argument
    arg = () => Math.atan2(this.y, this.x);

    // Reciprocal
    inv = () => this.conj().divRe(this.magSq());

    // Square
    sqr = () => this.mul(this);

    // Normalization
    normalize = () => this.div(this.mag());

    // Distance between complex numbers
    dist = (z) => this.sub(z).mag();

    sqrt = () => {
        // Square root
        let len = this.mag();
        let sgn = (this.y >= 0 ? 1 : -1);
        
        return new Complex(
            Math.sqrt(0.5 * (len + this.x)),
            Math.sqrt(0.5 * (len - this.x)) * sgn);
    }
}

// Abbreviated constructors
export const complex = (x, y) => new Complex(x, y);
export const Re = (k) => complex(k, 0);
export const Im = (k) => complex(0, k);

// Euler's formula
export const cis = (t) => complex(Math.cos(t), Math.sin(t));

// Constants
Complex.ONE = Re(1);
Complex.I = Im(1);
Complex.ZERO = complex(0, 0);

/*
Circle class.
*/

export class Circle {
    /**
     * Creates a new circle.
     * @param {Complex} cen Circle's center.
     * @param {Number} rad Circle's radius.
     */
    constructor(cen, rad) {
        this.cen = cen;
        this.rad = Math.abs(rad);
    }
}

/*
Moebius transformation stuff.
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

    apply(z) {
        // Transforms a given point
        let num = this.a.mul(z).add(this.b);
        let den = this.c.mul(z).add(this.d);
        return num.div(den);
    }

    transformCircle(circ) {
        // Applies the current Moebius transformation to a given circle
        // This formula was given on pg. 91 of the book Indra's Pearls
        let den = this.d.div(this.c).add(circ.cen).conj();
        let pt = circ.cen.sub(den.inv().mulRe(sqr(circ.rad)));

        let cen = this.apply(pt);
        let rad = cen.dist(this.apply(circ.cen.add(Re(circ.rad))));
        return new Circle(cen, rad);
    }

    mul(z) {
        // Moebius transform coefficient scalar multiplication
        return new MoebiusTransformation(
            this.a.mul(z),
            this.b.mul(z),
            this.c.mul(z),
            this.d.mul(z));
    }

    compose(tran) {
        // Composes two Moebius transformations by matrix multiplications
        return new MoebiusTransformation(
            this.a.mul(tran.a).add(this.b.mul(tran.c)),
            this.a.mul(tran.b).add(this.b.mul(tran.d)),
            this.c.mul(tran.a).add(this.d.mul(tran.c)),
            this.c.mul(tran.b).add(this.d.mul(tran.d)));
    }

    // Determinant of current Moebius transformation
    det = () => this.a.mul(this.d).sub(this.b.mul(this.c));

    // Inverse of current Moebius transformation
    inv = () => new MoebiusTransformation(
        this.d, this.b.neg(),
        this.c.neg(), this.a
    ).mul(this.det().inv());
}

/*
Other functions.
*/

// Simple squaring routine
export const sqr = (x) => x * x;

// Clamp a value to a range
export const clamp = (t, a, b) => Math.min(b, Math.max(a, t));