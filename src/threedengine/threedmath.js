/**
 * This is the math for the 3D engine: 3x3 matrices, vectors, and quaternions.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

// Vector math.

export class Vec3 {
    /**
     * Creates a new 3D vector.
     * @param {Number} x X-component.
     * @param {Number} y Y-component.
     * @param {Number} z Z-component.
     */
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    // Vector addition
    add(v) { return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z); }

    // Vector subtraction
    sub(v) { return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z); }

    // Vector multiplication by a scalar
    mul(k) { return new Vec3(this.x * k, this.y * k, this.z * k); }

    mulMatrix(m) { 
        // Vector-matrix multiplication
        return new Vec3(
            this.x * m.vals[0][0] + this.y * m.vals[0][1] + this.z * m.vals[0][2],
            this.x * m.vals[1][0] + this.y * m.vals[1][1] + this.z * m.vals[1][2],
            this.x * m.vals[2][0] + this.y * m.vals[2][1] + this.z * m.vals[2][2]
        ); 
    }

    // Vector division by a scalar
    div(k) { return this.mul(1 / k); }

    // Vector dot product
    dot(v) { return this.x * v.x + this.y * v.y + this.z * v.z; }

    cross(v) {
        // Cross product
        return new Vec3(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x);
    }

    // Vector squared norm
    normSq() { return this.dot(this); }

    // Vector norm
    norm() { return Math.sqrt(this.normSq()); }

    // Normalization of a vector
    normalize() { return this.div(this.norm()); }

    // Vector negation
    neg() { return this.mul(-1); }

    // Shallow copy
    clone() { return new Vec3(this.x, this.y, this.z); }
}

// GLSL-style abbreviated constructor
export const vec3 = (x, y, z) => new Vec3(x, y, z);

// 3x3 matrix (column-major) math. Mostly this is used in one or two demos; 
// rotations are performed using quaternions.

export class Mat3 {
    /**
     * Creates a new 3x3 matrix.
     * @param {Array.<Number>} a First column. 
     * @param {Array.<Number>} b Second column.
     * @param {Array.<Number>} c Third column.
     */
    constructor(a, b, c) {
        this.vals = [a, b, c];
    }

    mul(m) {
        // Multiply two matrices
        let newMat = new Mat3([], [], []);

        for (let c = 0; c < 3; c ++) {
            for (let r = 0; r < 3; r ++) {
                newMat.vals[r][c] = this.vals[r][0] * m.vals[0][c] + this.vals[r][1] * m.vals[1][c] + this.vals[r][2] * m.vals[2][c];
            }
        }

        return newMat;
    }

    transpose() {
        // Matrix transpose
        return new Mat3(
            [this.vals[0][0], this.vals[1][0], this.vals[2][0]],
            [this.vals[0][1], this.vals[1][1], this.vals[2][1]],
            [this.vals[0][2], this.vals[1][2], this.vals[2][2]]);
    }

    getVector(i) {
        // Gets the i-th basis vector from the matrix
        return vec3(
            this.vals[i][0],
            this.vals[i][1],
            this.vals[i][2]);
    }
}

export const mat3 = (a, b, c) => new Mat3(a, b, c);

export const MAT3_IDENTITY = mat3([1, 0, 0], [0, 1, 0], [0, 0, 1]);

// Rotation matrices

export const getRotMatY = (t) => {
    // Computes the Y-axis rotation matrix for a given angle
    let c = Math.cos(t);
    let s = Math.sin(t);

    return mat3(
        [c, 0, -s],
        [0, 1, 0],
        [s, 0, c]
    );
}

export const getRotMatZ = (t) => {
    // Computes the Z-axis rotation matrix for a given angle
    let c = Math.cos(t);
    let s = Math.sin(t);

    return mat3(
        [c, -s, 0],
        [s, c, 0],
        [0, 0, 1]
    );
}

// Quaternion math.

export class Quaternion {
    /**
     * Creates a new quaternion.
     * @param {Number} re Real part.
     * @param {Vec3} vec Vector part.
     */
    constructor(re, vec) {
        this.re = re;
        this.vec = vec;
    }

    mul(q) {
        // Quaternion-quaternion product
        return new Quaternion(
            this.re * q.re - this.vec.dot(q.vec),
            q.vec.mul(this.re)
                .add(this.vec.mul(q.re))
                .add(this.vec.cross(q.vec)));
    }

    // Quaternion-real multiplication
    mulRe(k) { return new Quaternion(this.re * k, this.vec.mul(k)); }

    // Quaternion-real division
    divRe(k) { return this.mulRe(1 / k); }

    rot(v) { 
        // Rotation of a vector using the Euler-Rodrigues formula
        let c = this.vec.cross(v);
        return v.add(c.mul(this.re).add(this.vec.cross(c)).mul(2));
    }

    // Quaternion conjugate
    conj() { return new Quaternion(this.re, this.vec.neg()); }

    // Squared norm
    normSq() { return this.re * this.re + this.vec.normSq(); }

    // Norm
    norm() { return Math.sqrt(this.normSq()); }

    // Versor (unit quaternion) 
    versor() { return this.divRe(this.norm()); }

    // Shallow copy
    clone() { return new Quaternion(this.re, this.vec); }

    asMatrix() {
        // Conversion of a unit quaternion to a rotation matrix
        let [a, b, c, d] = [this.re, this.vec.x, this.vec.y, this.vec.z];
        return mat3(
            [a * a + b * b - c * c - d * d, 2 * (b * c + a * d), 2 * (b * d - a * c)],
            [2 * (b * c - a * d), a * a + c * c - b * b - d * d, 2 * (c * d + a * b)],
            [2 * (b * d + a * c), 2 * (c * d - a * b), a * a + d * d - b * b - c * c]);
    }
}

// Quaternion from 4 real numbers
export const quatFromReals = (a, b, c, d) => new Quaternion(a, vec3(b, c, d));

export const quatFromVecs = (u, v) => {
    // Unit quaternion from 2 unit vectors
    return new Quaternion(u.dot(v), u.cross(v)).versor();
}

// Quaternion identity rotation
export const QUAT_IDENTITY = quatFromReals(1, 0, 0, 0);