/**
 * This is the actual wireframe 3D engine, with some accompanying utilities.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

import { vec3, quatFromVecs, QUAT_IDENTITY } from './threedmath';

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

// A basic line segment class, possessing color and opacity.

export class Segment {
    /**
     * Creates a new line segment.
     * @param {Vec3} ptA First point.
     * @param {Vec3} ptB Second point.
     * @param {String} col Color (default is white).
     * @param {Number} opacity Opacity (default is 1).
     */
    constructor(ptA, ptB, col = "white", opacity = 1) {
        this.ptA = ptA;
        this.ptB = ptB;
        this.col = col;
        this.opacity = opacity;
    }

    // Get the midpoint of the transformed segment
    getMidpoint = () => this.tranA.add(this.tranB).mul(0.5);

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

// This is the actual engine. 

const epsilon = 1e-2, maxDis = 1000;
const sclCoeff = 0.7;

const dt = 1.5e-2;
const camZ = 5;

export default class Engine3D {
    constructor(canvas, updateFn) {
        // Initialize canvas context
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        // Scale and clip planes
        this.clipPlanes = [
            new ClipPlane(vec3(0, 0, -1), -epsilon),
            new ClipPlane(vec3(0, 0, 1), maxDis)];
        this.sclInfo = {};
        this.isMobile = false;

        // Initialize rotation and geometry
        this.rotQuat = QUAT_IDENTITY;
        this.meshes = [];

        // Animation stuff
        this.updateFn = updateFn;
        this.isRunning = true;
        this.t = 0;

        this.addEvtListeners();
        this.handleResize();
        this.startAnimation();
    }

    /**
     * Disposes the engine: removes event listeners and stops the animation.
     */
    dispose() {
        this.stopAnimation();
        this.canvas.removeEventListener("mousedown", this.onInteractionStart);
        this.canvas.removeEventListener("touchstart", this.onInteractionStart);
        this.canvas.removeEventListener("mousemove", this.onInteractionMove);
        this.canvas.removeEventListener("touchmove", this.onInteractionMove);
        
        this.canvas.removeEventListener("mouseup", this.onInteractionEnd);
        this.canvas.removeEventListener("mouseout", this.onInteractionEnd);
        this.canvas.removeEventListener("touchcancel", this.onInteractionEnd);
        this.canvas.removeEventListener("touchend", this.onInteractionEnd);
        window.removeEventListener("resize", this.handleResize);
    }

    /**
     * Internal function for adding mouse event listeners to the canvas,
     * and adding a resize listener to the page.
     */
    addEvtListeners() {
        this.canvas.addEventListener("mousedown", this.onInteractionStart.bind(this));
        this.canvas.addEventListener("touchstart", this.onInteractionStart.bind(this), {passive: true});
        this.canvas.addEventListener("mousemove", this.onInteractionMove.bind(this));
        this.canvas.addEventListener("touchmove", this.onInteractionMove.bind(this), {passive: true});
        
        this.canvas.addEventListener("mouseup", this.onInteractionEnd.bind(this));
        this.canvas.addEventListener("mouseout", this.onInteractionEnd.bind(this));
        this.canvas.addEventListener("touchcancel", this.onInteractionEnd.bind(this));
        this.canvas.addEventListener("touchend", this.onInteractionEnd.bind(this));
        window.addEventListener("resize", this.handleResize.bind(this));
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
            width, height, hW, hH, scale,
            scaleFac: scale * sclCoeff};

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
     * Gets the point to compute the rotation quaternion from a given
     * mouse or touch event. This is based on the method described in
     * Robert Eisele's extremely informative article:
     * https://raw.org/code/trackball-rotation-using-quaternions/.
     * 
     * @param {Event} evt Event to process.
     * @returns Point to compute rotation from.
     */
    getRotPoint(evt) {
        // Get point in canvas space from event
        if (evt.touches && evt.touches.length > 0) {
            evt = evt.touches.item(0);
        }

        let box = this.canvas.getBoundingClientRect();
        let posX = evt.clientX - box.left;
        let posY = evt.clientY - box.top;

        // Get the point for the rotation according to Bell's trackball formula
        let scl = this.sclInfo;
        posX = (scl.width - 2 * posX) / scl.scale;
        posY = (2 * posY - scl.height) / scl.scale;
        let r = posX * posX + posY * posY;

        if (r < .5) {
            return vec3(posX, posY, Math.sqrt(1 - r));
        } else {
            return vec3(posX, posY, .5 / Math.sqrt(r));
        }
    }

    /**
     * Handles a click/drag being started.
     * @param {Event} evt Event to process.
     */
    onInteractionStart(evt) {
        // Store initial point and quaternion
        this.isDragging = true;
        this.startQuat = this.rotQuat.clone();
        this.startPt = this.getRotPoint(evt);
        document.body.classList.add("dragging");
    }

    /**
     * Updates the rotation quaternion when the user drags
     * the mouse or moves the touchscreen.
     * @param {Event} evt Event to process.
     */
    onInteractionMove(evt) {
        if (this.isDragging) {
            let currPt = this.getRotPoint(evt);
            let newQuat = quatFromVecs(this.startPt, currPt);
            this.rotQuat = newQuat.mul(this.startQuat);
        }
    }

    /**
     * Stops dragging when the user releases the mouse
     * or touchscreen.
     */
    onInteractionEnd() {
        this.isDragging = false;
        document.body.classList.remove("dragging");
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
        if (this.isRunning && this.updateFn) {
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
        pt = this.rotQuat.rot(pt);
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
        // Transform segment geometry
        let segments = this.meshes.flat();
        segments = segments.map(seg => {
            seg.tranA = this.viewTransform(seg.ptA);
            seg.tranB = this.viewTransform(seg.ptB);
            return seg;
        });

        // Sort and draw segments
        segments = segments.sort((a, b) => b.getMidpoint().z - a.getMidpoint().z);
        for (let seg of segments) {
            this.drawSegment(seg);
        }
    }

    /**
     * Draws a 3D segment.
     * @param {Segment} seg Segment to draw. 
     */
    drawSegment(seg) {
        // Clip against front and back of frustum
        if (!seg.clip(this.clipPlanes[0])) return;
        if (!seg.clip(this.clipPlanes[1])) return;

        // Apply projective transformation
        seg.tranA = this.projTransform(seg.tranA);
        seg.tranB = this.projTransform(seg.tranB);

        // Clip against sides of frustum
        for (let i = 2; i < 6; i ++) {
            if (!seg.clip(this.clipPlanes[i])) return;
        }

        // Draw projected segment
        this.ctx.globalAlpha = seg.opacity;
        this.ctx.strokeStyle = seg.col;
        this.ctx.beginPath();
        this.ctx.moveTo(seg.tranA.x, seg.tranA.y);
        this.ctx.lineTo(seg.tranB.x, seg.tranB.y);
        this.ctx.stroke();
    }
}