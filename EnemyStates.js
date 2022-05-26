//chasing the player, occurs when the player is more than 120 units away
class ChasePlayer {
  execute(i) {
    var dir = p5.Vector.sub(player.position, enemies[i].position);
    //print(dir)
    var angleDiff = (180 * enemies[i].velocity.angleBetween(dir)) / PI;
    //print(angleDiff)

    //rotate and move towards the player
    if (angleDiff > 1) {
      enemies[i].angle += 1;
      enemies[i].velocity.setHeading((enemies[i].angle * PI) / 180);
      enemies[i].spinning = 1;
      enemies[i].moving = 1;
    } else if (angleDiff < -1) {
      enemies[i].angle -= 1;
      enemies[i].velocity.setHeading((enemies[i].angle * PI) / 180);
      enemies[i].spinning = -1;
      enemies[i].moving = 1;
    } else {
      enemies.spinning = 0;
      enemies[i].moving = 1;
    }
    enemies[i].move();

    //change states!
    if (player.alive == false) {
      enemies[i].state = 4;
    } else if (enemies[i].alive == false) {
      enemies[i].state = 3;
    } else if (enemies[i].checkBulletPaths() == true) {
      enemies[i].state = 2;
    } else if (
      dist(
        player.position.x,
        player.position.y,
        enemies[i].position.x,
        enemies[i].position.y
      ) < 120
    ) {
      enemies[i].state = 1; //change
    }
  }
}

//shooting the player occurs when the player is closer than 120 units
class ShootPlayer {
  execute(i) {
    var dir = p5.Vector.sub(player.position, enemies[i].position);
    //print(dir)
    var angleDiff = (180 * enemies[i].velocity.angleBetween(dir)) / PI;

    //rotate towards the player
    if (angleDiff > 2) {
      enemies[i].angle += 2;
      enemies[i].velocity.setHeading((enemies[i].angle * PI) / 180);
      enemies[i].spinning = 1;
      enemies[i].moving = 0;
    } else if (angleDiff < -2) {
      enemies[i].angle -= 2;
      enemies[i].velocity.setHeading((enemies[i].angle * PI) / 180);
      enemies[i].spinning = -1;
      enemies[i].moving = 0;
    } else {
      enemies[i].spinning = 0;
      enemies[i].moving = 0;
    }

    enemies[i].shoot();

    //change states!
    if (player.alive == false) {
      enemies[i].state = 4;
    } else if (enemies[i].alive == false) {
      enemies[i].state = 3;
    } else if (enemies[i].checkBulletPaths() == true) {
      enemies[i].state = 2;
      //print("DODGE")
    } else if (
      dist(
        player.position.x,
        player.position.y,
        enemies[i].position.x,
        enemies[i].position.y
      ) > 120
    ) {
      enemies[i].state = 0;
    }
  }
}

//dodging bullets occurs when in the path of a bullet!
class DodgeBullets {
  execute(i) {
    //change states!
    if (player.alive == false) {
      enemies[i].state = 4;
    } else if (enemies[i].checkBulletPaths() == false)
      if (enemies[i].alive == false) {
        enemies[i].state = 3; //SHOULD BE 3
      } else if (
        dist(
          player.position.x,
          player.position.y,
          enemies[i].position.x,
          enemies[i].position.y
        ) > 150
      ) {
        enemies[i].state = 0;
      } else {
        enemies[i].state = 1;
      }
  }
}

//if dead, don't move
class Dead {
  execute(i) {
    enemies[i].spinning = 0;
    enemies[i].moving = 0;
  }
}

//if player is dead, wander around!
class Wander {
  constructor() {
    this.lastUpdate = -100;
    this.move = 0;
    this.rotate = 0;
  }
  execute(i) {
    
    //randomly determine direction and movement
    if (frameCount > this.lastUpdate + 60) {
      this.move = floor(random(0, 2));
      this.rotate = floor(random(-1, 2));
      this.lastUpdate = frameCount;
    }

    if (this.rotate == 1) {
      enemies[i].angle += 1;
      enemies[i].velocity.setHeading((enemies[i].angle * PI) / 180);
      enemies[i].spinning = 1;
    } else if (this.rotate == -1) {
      enemies[i].angle -= 1;
      enemies[i].velocity.setHeading((enemies[i].angle * PI) / 180);
      enemies[i].spinning = -1;
    } else {
      enemies[i].spinning = 0;
    }
    if (this.move == 1) {
      enemies[i].move();
      enemies[i].moving = 1;
    } else {
      enemies[i].moving = 0;
    }

    //small chance that a tank dies after player dies
    if (enemies[i].alive == false) {
      enemies[i].state = 3;
    }
  }
}
