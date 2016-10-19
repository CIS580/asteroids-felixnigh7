(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* Mitchell Baker
   astroids from  http://opengameart.org/content/rock-type-planet
   ship from      http://opengameart.org/content/titan-battlecruiser
*/
"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const Entity = require('./entity.js');
const Astroids = require('./astroids.js');
const Lasers = require('./lasers.js');

/* Global variables */
var canvas = document.getElementById('screen');
var entity = new Entity();
var game = new Game(canvas, update, render);
var player = new Player({x: canvas.width/2, y: canvas.height/2}, canvas);

//sounds
var laserFired = new Audio();
laserFired.src = './assets/laser_shooting_sfx.wav';

var level = 1;
var score = 0;
var lives = 5;
var astroids = [];
for(var i = 0; i <= 10; i++) {
  astroids.push(new Astroids({x: Math.floor(Math.random() * canvas.width + 10),
                              y: Math.floor(Math.random() * canvas.height + 10),
                              width: 64,
                              height: 64},{
                                x: Math.random(),
                                y: Math.random()
                              },
                              canvas));
}
var lasers = [];
var fire = false;

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


window.onkeydown = function(event) {
  console.log("VelocityX= " + player.velocity.x);
  console.log("VelocityY= " + player.velocity.y);
  console.log("positionx: " + player.position.x);
  console.log("positionY: " + player.position.y);
  switch(event.key) {
    case 'ArrowUp': // up
    case 'w':
      player.thrusting = true;
      break;
    case 'ArrowLeft': // left
    case 'a':
      player.steerLeft = true;
      break;
    case 'ArrowRight': // right
    case 'd':
      player.steerRight = true;
      break;
    case ' ': //space
      if(fire == false && player.state != "dead") {
        lasers.push(new Lasers({
          x: player.position.x,
          y: player.position.y,
          angle: player.angle % (2 * Math.PI) + Math.PI / 2},
          canvas));
          fire = true;
          laserFired.play();
      }
      break;
    case 'r':
      player.position = {
        x: (Math.random() * player.worldWidth),
        y: (Math.random() * player.worldHeight)
      };
      break;
  }
}

window.onkeyup = function(event) {
  switch(event.key) {
    case 'ArrowUp': // up
    case 'w':
      player.thrusting = false;
      break;
    case 'ArrowLeft': // left
    case 'a':
      player.steerLeft = false;
      break;
    case 'ArrowRight': // right
    case 'd':
      player.steerRight = false;
      break;
    case ' ':
      fire = false;
      break;
  }
}
/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {

  player.update(elapsedTime);

  astroids.forEach(function(astroid) {
    astroid.update();
  });
  lasers.forEach(function(laser) {
    laser.update();
  });
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.render(elapsedTime, ctx);
  // render astroids
  for(var i = 0; i < astroids.length; i++) {
    astroids[i].render(elapsedTime, ctx);
  }
  // render lasers
  lasers.forEach(function(laser){laser.render(elapsedTime, ctx);});
  /*
  if(player.state == "dead") {
    if(count)
  }
  */
  //scores
  ctx.fillStyle = "green";
  ctx.font = "bold 16px Arial";
  ctx.fillText("Level: " + level, 0, 10);
  ctx.fillStyle = "green";
  ctx.font = "bold 16px Arial";
  ctx.fillText("Score: " + score, 1, 30);
  ctx.fillStyle = "green";
  ctx.font = "bold 16px Arial";
  ctx.fillText("Lives: " + lives, 1, 50);


  if(lives == 0) {
    game.over = true;
    ctx.fillStyle = "red";
    ctx.font = "bold 16px Arial";
    ctx.fillText("Game Over", canvas.width/2, canvas.height/2);
  }
}

},{"./astroids.js":2,"./entity.js":3,"./game.js":4,"./lasers.js":5,"./player.js":6}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
//Template based off Nathan Bean's lecture notes
"use strict";

module.exports = exports = Entity;

function Entity() {

}

//this helps with solbing collisions
Entity.prototype.checkForCollision = function(r1, r2) {
  if( (r1.position.y + r1.height < r2.position.y) || //r1 is above r2
      (r1.position.y > r2.position.y + r2.height) || //r1 is left r2
      (r1.position.x > r2.position.x + r2.width) ||  //r1 is right r2
      (r1.position.x + r1.width < r2.position.x) )
    return false;
  else return true;
  };

},{}],4:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],5:[function(require,module,exports){
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
   //this.worldWidth = canvas.width;
   //this.worldHeight = canvas.height;
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

},{}],6:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Player class
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Player(position, canvas) {
  this.worldWidth = canvas.width;
  this.worldHeight = canvas.height;

  this.state = "idle";
  this.position = {
    x: position.x,
    y: position.y
  };
  this.velocity = {
    x: 0,
    y: 0
  }
  this.angle = 0;
  this.radius  = 64;
  this.thrusting = false;
  this.steerLeft = false;
  this.steerRight = false;
  //this.fire = false;        // for shooting lasers

  //var self = this;

}

// fire lasers.
//Player.prototype.fire = function() {
//  return this.fire;
//}

/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function(time) {
  //console.log("Player:UPDATE Begin = ");

  // Apply angular velocity
  if(this.steerLeft) {
    this.angle += time * 0.005;
  }
  if(this.steerRight) {
    this.angle -= 0.1;
  }
  // Apply acceleration
  if(this.thrusting) {
    var acceleration = {
      x: Math.sin(this.angle),
      y: Math.cos(this.angle)
    }
    //console.log("acceleration = " + acceleration);
    this.velocity.x -= acceleration.x;
    this.velocity.y -= acceleration.y;
  }
  // Apply velocity
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;
  // Wrap around the screen
  if(this.position.x < 0) this.position.x += this.worldWidth;
  if(this.position.x > this.worldWidth) this.position.x -= this.worldWidth;
  if(this.position.y < 0) this.position.y += this.worldHeight;
  if(this.position.y > this.worldHeight) this.position.y -= this.worldHeight;
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Player.prototype.render = function(time, ctx) {
  ctx.save();

  // Draw player's ship
  if(this.state != "dead") {
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(-this.angle);
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(-10, 10);
    ctx.lineTo(0, 0);
    ctx.lineTo(10, 10);
    ctx.closePath();
    ctx.strokeStyle = 'white';
    ctx.stroke();

    // Draw engine thrust
    if(this.thrusting) {
      ctx.beginPath();
      ctx.moveTo(0, 20);
      ctx.lineTo(5, 10);
      ctx.arc(0, 10, 5, 0, Math.PI, true);
      ctx.closePath();
      ctx.strokeStyle = 'red';
      ctx.stroke();
    }
  }

  ctx.restore();
}

},{}]},{},[1]);
