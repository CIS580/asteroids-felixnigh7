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
