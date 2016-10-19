"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Laser class
 */
module.exports = exports = Laser;

/**
 * @constructor Laser
 * Creates a new Laser object
 * @param {Postition} position object specifying an x and y
 */
 function Laser(position, angle, canvas) {

   this.position = {
     x: position.x,
     y: position.y
   };
   this.angle = position.angle;
   this.velocity = {
     x: Math.cos(this.angle),
     y: Math.sin(this.angle)
   }
   this.color = 'red';
 }

 Laser.prototype.update = function(time) {
   // lasers speed.
   this.position.x += this.velocity.x * 5;
   this.position.y -= this.velocity.y * 5;
 }

 /**
  * @function renders the Laser into the provided context
  * {DOMHighResTimeStamp} time the elapsed time since the last frame
  * {CanvasRenderingContext2D} ctx the context to render into
  */
 Laser.prototype.render = function(time, ctx) {
   ctx.save();
   ctx.strokeStyle = this.color;
   ctx.lineWidth = 2;
   ctx.beginPath();
   ctx.moveTo(this.position.x, this.position.y);
   ctx.lineTo(this.position.x + 10 * this.velocity.x, this.position.y - 10 * this.velocity.y);
   ctx.stroke();
   ctx.restore();
 }
