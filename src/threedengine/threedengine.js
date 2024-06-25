/**
 * This is the 3D engine, which is capable of drawing points and lines.
 * There are also some accompanying utilities in this file.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

import QuaternionTrackball from './quat_trackball';
import { vec3 } from './threedmath';

// A clip plane class.
class ClipPlane {
    /**
     * Creates a new clip plane.
     * @param {Vec3} nrm Normal.
     * @param {Number} dis Distance to origin.
     */
    constructor(nrm, dis) {
        this.nrm = nrm;
        this.dis = dis;
    }

    sameSide(pt) {
        // Test on which side of this plane a given point lies
        return (pt.dot(this.nrm) < this.dis);
    }
}

// This is a generic 3D object class, which the Point and Segment classes inherit.
class ThreeDObject {
    /**
     * Creates a new generic 3D object.
     * @param {String} col Color.
     */
    constructor(col) {
        this.col = col;
    }
}

// A basic line segment class, possessing color, opacity, and thickness.
export class Segment extends ThreeDObject {
    /**
     * Creates a new line segment.
     * @param {Vec3} ptA First point.
     * @param {Vec3} ptB Second point.
     * @param {String} col Color (default is white).
     * @param {Number} opacity Opacity (default is 1).
     * @param {Number} thickness Thickness (default is 1).
     */
    constructor(ptA, ptB, col = "white", opacity = 1, thickness = 1) {
        super(col);
        this.ptA = ptA;
        this.ptB = ptB;
        this.opacity = opacity;
        this.thickness = thickness;
    }

    copyPos() {
        // Copy points to transform buffer
        this.tranA = this.ptA.clone();
        this.tranB = this.ptB.clone();
    }

    transform(tran) {
        // Transforms the points of the segment
        this.tranA = tran(this.tranA);
        this.tranB = tran(this.tranB);
    }

    // Get the Z-coordinate of the midpoint of the transformed segment to sort
    getSortCoord = () => (this.tranA.z + this.tranB.z) * 0.5;

    clip(pln) {
        // Test which side of the plane each vertex lies in
        let side0 = pln.sameSide(this.tranA);
        let side1 = pln.sameSide(this.tranB);

        if (side0 && side1) {
            // All points are inside the plane
            return true;
        } else if (!side0 && !side1) {
            // No points are inside the plane
            return false;
        }

        // Plane-segment intersection
        let dif = this.tranB.sub(this.tranA);
        let t = (pln.dis - this.tranA.dot(pln.nrm)) / dif.dot(pln.nrm);
        let intPt = this.tranA.add(dif.mul(t));

        // One point is on the same side
        if (side0) {
            this.tranB = intPt;
        } else {
            this.tranA = intPt;
        }
        return true;
    }
}

// A basic point class possessing color and radius.
export class Point extends ThreeDObject {
    /**
     * Creates a new point. 
     * @param {Vec3} pos Point position.
     * @param {String} col Point color.
     * @param {Number} rad Point radius.
     */
    constructor(pos, col, rad) {
        super(col);
        this.pos = pos;
        this.rad = rad;
    }

    // Copy the position to the buffer
    copyPos = () => this.tranPos = this.pos.clone();

    // Transform the point
    transform = (tran) => this.tranPos = tran(this.tranPos);

    // Get Z-coordinate to sort
    getSortCoord = () => this.tranPos.z;

    // Clip against a plane
    clip = (pln) => pln.sameSide(this.tranPos);
}

// Some constants.
const epsilon = 1e-2, maxDis = 1000;
const sclCoeff = 0.7;

const dt = 1.5e-2;
const camZ = 5;


// This is the actual engine. 
export default class Engine3D {
    /**
     * Creates a new 3D engine.
     * @param {Canvas} canvas Canvas to draw to.
     * @param {Function} updateFn Function to call every frame (if any).
     */
    constructor(canvas, updateFn) {
        // Initialize canvas context and trackball
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        // Scale and clip planes
        this.clipPlanes = [
            new ClipPlane(vec3(0, 0, -1), -epsilon),
            new ClipPlane(vec3(0, 0, 1), maxDis)];
        this.sclInfo = {};
        this.isMobile = false;

        // Initialize rotation and geometry
        this.trackball = new QuaternionTrackball(this.canvas);
        this.objects = [];

        // Animation stuff
        this.updateFn = updateFn;
        this.isRunning = true;
        this.t = 0;
        
        window.addEventListener("resize", this.handleResize.bind(this));
        this.handleResize();
        this.startAnimation();
    }

    /**
     * Disposes the engine: removes event listeners and stops the animation.
     */
    dispose() {
        this.stopAnimation();
        this.trackball.dispose();
        window.removeEventListener("resize", this.handleResize);
    }

    /**
     * Updates the scale info, resizes/transforms the canvas,
     * and recomputes the planes of the frustum when the window
     * is resized.
     */
    handleResize() {
        // Get width and height
        let width = window.innerWidth;
        let height = window.innerHeight;
        let hW = width * 0.5;
        let hH = height * 0.5;
        let scale = Math.min(width, height);

        this.canvas.width = width;
        this.canvas.height = height;
        let isMobile = (width < 768);
        
        // Stop animation if mobile
        if (isMobile) {
            this.stopAnimation();
        } else if (this.isMobile) {
            this.startAnimation();
        }
        this.isMobile = isMobile;

        // Set scale info
        this.sclInfo = {
            width, height, hW, hH,
            scaleFac: scale * sclCoeff};
        this.trackball.setSize(width, height);

        // Create clip planes
        this.clipPlanes[2] = new ClipPlane(vec3(1, 0, 0), hW);
        this.clipPlanes[3] = new ClipPlane(vec3(-1, 0, 0), hW);
        this.clipPlanes[4] = new ClipPlane(vec3(0, 1, 0), hH);
        this.clipPlanes[5] = new ClipPlane(vec3(0, -1, 0), hH);

        // Transform canvas: scale and set center
        if (this.ctx) {
            this.ctx.resetTransform();
            this.ctx.translate(hW, hH);
            this.ctx.scale(1, -1);
        }
    }

    /**
     * Starts the animation loop.
     */
    startAnimation() {
        this.animFrame = requestAnimationFrame(this.mainLoop.bind(this));
    }

    /**
     * Stops the animation loop.
     */
    stopAnimation() {
        cancelAnimationFrame(this.animFrame);
    }

    /**
     * The main animation loop.
     */
    mainLoop() {
        // Clear the canvas
        this.ctx.clearRect(
            -this.sclInfo.hW, -this.sclInfo.hH, 
            this.sclInfo.width, this.sclInfo.height);
        
        // Update and redraw
        if (this.updateFn) {
            this.updateFn(this.t);
        }
        this.redrawScene();

        // Step forward in time if animation is running
        this.t += this.isRunning * dt;
        this.animFrame = requestAnimationFrame(this.mainLoop.bind(this));
    }

    /**
     * Applies the viewing transformation (rotation, then shift).
     * @param {Vec3} pt Point to transform.
     * @returns Transformed point.
     */
    viewTransform(pt) {
        // Applies the viewing transformation in 3D space
        pt = this.trackball.rotQuat.rot(pt);
        pt.z += camZ;
        return pt;
    }

    /**
     * Applies the projection transformation.
     * @param {Vec3} pt Point to project.
     * @returns Projected point.
     */
    projTransform(pt) {
        // Applies the projective transformation from 3D to 2D
        let k = this.sclInfo.scaleFac / pt.z;
        pt.x *= k; pt.y *= k;
        return pt;
    }

    /**
     * Redraws the scene.
     */
    redrawScene() {
        // Transform scene geometry in view space
        let geom = this.objects.flat();
        for (let obj of geom) {
            obj.copyPos();
            obj.transform(this.viewTransform.bind(this));
        }

        // Sort and draw geometry
        geom = geom.sort((a, b) => b.getSortCoord() - a.getSortCoord());
        for (let obj of geom) {
            this.drawObject(obj);
        }
    }

    /**
     * Draws a 3D object to the screen.
     * @param {ThreeDObject} obj Object to draw. 
     */
    drawObject(obj) {
        // Clip against front and back of frustum
        if (!obj.clip(this.clipPlanes[0])) return;
        if (!obj.clip(this.clipPlanes[1])) return;

        // Apply projective transformation
        obj.transform(this.projTransform.bind(this));

        // Clip against sides of frustum
        for (let i = 2; i < 6; i ++) {
            if (!obj.clip(this.clipPlanes[i])) return;
        }

        // Draw projected object
        if (obj instanceof Segment) {
            // Object is a segment
            this.ctx.lineWidth = obj.thickness;
            this.ctx.globalAlpha = obj.opacity;
            this.ctx.strokeStyle = obj.col;

            this.ctx.beginPath();
            this.ctx.moveTo(obj.tranA.x, obj.tranA.y);
            this.ctx.lineTo(obj.tranB.x, obj.tranB.y);
            this.ctx.stroke();
        } else {
            // Object is a point
            this.ctx.globalAlpha = 1;
            this.ctx.fillStyle = obj.col;
        
            this.ctx.beginPath();
            this.ctx.arc(obj.tranPos.x, obj.tranPos.y, obj.rad, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }
}