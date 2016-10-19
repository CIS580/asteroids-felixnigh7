"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the astroids class
 */
module.exports = exports = Astroids;

/**
 * @constructor astroids
 * Creates a new astroids object
 * @param {Postition} position object specifying an x and y
 */

 function Astroids(position, velocity, canvas) {
   this.worldWidth = canvas.width;
   this.worldHeight = canvas.height;
   this.position = {
     x: position.x,
     y: position.y
   };
   this.velocity = {
     x: velocity.x,
     y: velocity.y
   }
   this.width = position.width;
   this.height = position.height;
   this.angle = Math.random();
   this.radius = this.width/2;

   this.spritesheet = new Image();
   this.spritesheet.src = encodeURI('assets/Asteroids_01/Asteroids_01/Asteroids_256x256_001.png');
 }

 Astroids.prototype.update = function(time) {
   //console.log("astroid:UPDATE Begin = ");
   //console.log("VelocityX= " + this.velocity.x);
   //console.log("VelocityY= " + this.velocity.y);
   //console.log("positionx: " + this.position.x);
   //console.log("positionY: " + this.position.y);
   // Astroid's speed.
   this.position.x += this.velocity.x;
   this.position.y += this.velocity.y;
   // Wrap around the screen
   if(this.position.x < 0) this.position.x += this.worldWidth;
   if(this.position.x > this.worldWidth) this.position.x -= this.worldWidth;
   if(this.position.y < 0) this.position.y += this.worldHeight;
   if(this.position.y > this.worldHeight) this.position.y -= this.worldHeight;
 }

 /**
  * @function renders the Astroids into the provided context
  * {DOMHighResTimeStamp} time the elapsed time since the last frame
  * {CanvasRenderingContext2D} ctx the context to render into
  */
 Astroids.prototype.render = function(time, ctx) {
   ctx.save();

   // Draw Astroids
   ctx.drawImage(this.spritesheet, 0, 0, 320, 240, this.position.x, this.position.y, this.width, this.height);
   //ctx.rotate(-this.angle);
   ctx.restore();
 }
