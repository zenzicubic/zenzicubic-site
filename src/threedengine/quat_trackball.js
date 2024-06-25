/**
 * This is the quaternion trackball, used for various 3D demos.
 * This code is protected under the MIT license (see the LICENSE file).
 * @author Zenzicubic
 */

import { vec3, quatFromVecs, QUAT_IDENTITY } from './threedmath';

class QuaternionTrackball {
    /**
     * Creates a new quaternion trackball and attaches it 
     * to a given canvas.
     * @param {Canvas} canvas Canvas to rotate.
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.rotQuat = QUAT_IDENTITY;

        // Add event listeners
        this.canvas.addEventListener("mousedown", this.onInteractionStart.bind(this));
        this.canvas.addEventListener("touchstart", this.onInteractionStart.bind(this), {passive: true});
        this.canvas.addEventListener("mousemove", this.onInteractionMove.bind(this));
        this.canvas.addEventListener("touchmove", this.onInteractionMove.bind(this), {passive: true});
        
        this.canvas.addEventListener("mouseup", this.onInteractionEnd.bind(this));
        this.canvas.addEventListener("mouseout", this.onInteractionEnd.bind(this));
        this.canvas.addEventListener("touchcancel", this.onInteractionEnd.bind(this));
        this.canvas.addEventListener("touchend", this.onInteractionEnd.bind(this));
    }

    /**
     * Sets the width and height of the canvas.
     * @param {Number} width Width.
     * @param {Number} height Height.
     */
    setSize(width, height) {
        this.width = width;
        this.height = height;
        this.scale = 1 / Math.min(width, height);
    }

    /**
     * Removes the event listeners from the canvas.
     */
    dispose() {
        this.canvas.removeEventListener("mousedown", this.onInteractionStart);
        this.canvas.removeEventListener("touchstart", this.onInteractionStart);
        this.canvas.removeEventListener("mousemove", this.onInteractionMove);
        this.canvas.removeEventListener("touchmove", this.onInteractionMove);
        
        this.canvas.removeEventListener("mouseup", this.onInteractionEnd);
        this.canvas.removeEventListener("mouseout", this.onInteractionEnd);
        this.canvas.removeEventListener("touchcancel", this.onInteractionEnd);
        this.canvas.removeEventListener("touchend", this.onInteractionEnd);
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
        posX = (this.width - 2 * posX) * this.scale;
        posY = (2 * posY - this.height) * this.scale;
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
}

export default QuaternionTrackball;