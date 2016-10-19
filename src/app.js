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
      if(fire == false) {
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
  lasers.forEach(function(laser) {
    laser.render(elapsedTime, ctx);
  });
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
