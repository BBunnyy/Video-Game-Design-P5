//BULLET CLASS: Contains necessary methods to move bullets, and check when a bullet hits an object
class Bullet {
  constructor(x, y, angle) {
    this.position = new p5.Vector(x, y);
    this.velocity = new p5.Vector(2, 0);
    this.angle = angle;
    this.velocity.setHeading((angle * PI) / 180);

    this.hit = false;
  }

  draw() {
    push();

    translate(this.position.x, this.position.y);
    rotate(this.angle);

    fill(212, 175, 55);
    arc(0, 0, 8, 4, 270, 450);
    rect(-4, -2, 4, 4);

    pop();
  }

  move() {
    this.position.add(this.velocity);
  }

  collision() {
    for (var i = 0; i < enemies.length; i++) {
      //check collision with enemies
      if (
        dist(
          this.position.x,
          this.position.y,
          enemies[i].position.x,
          enemies[i].position.y
        ) < 13
      ) {
        //HIT!
        if (enemies[i].alive == true) {
          points++; //increment points if you kill a tank
        }
        enemies[i].alive = false; // kill enemies
        this.hit = true; //mark the bullet to be destroyed
      }
      //collision with player
      if (
        dist(
          this.position.x,
          this.position.y,
          player.position.x,
          player.position.y
        ) < 13
      ) {
        //HIT!
        player.alive = false; //kill the player
        //print("!!!!!!!!!!")
        this.hit = true; //mark that the bullet hit, so that you can destroy it
      }
    }
  }
}

class Tank {
  xtra() {
    //extra constructor
    return true;
  }

  constructor(x, y) {
    this.alive = true;

    this.position = new p5.Vector(x, y);
    this.velocity = new p5.Vector(1, 0);
    this.angle = 0;

    //Markers for animation
    this.spinning = 0; // -1 for Counter Clockwise, 0 for no spin, 1 for clock wise
    this.moving = 0; // -1 for backwards, 0 for no movement, 1 for forwards

    //Counters for Wheel rotation animation
    this.leftWheel = 0;
    this.rightWheel = 0;
    //speed of wheel animation
    this.wheelSpeed = 0.5;

    //marks when the last bullet was shot
    this.lastShot = -100000;
    this.bullets = []; //array of bullets for the tank

    this.xtra(); //extra initialization outside of default constructor
  }

  //draw the tank:
  draw() {
    //draw all the bullets!
    for (var j = 0; j < this.bullets.length; j++) {
      this.bullets[j].draw();
    }

    //if the tank is alive, animate the wheels!
    if (this.alive == true) {
      //not spinning, and moving forward
      if (this.spinning == 0 && this.moving == 1) {
        this.leftWheel += this.wheelSpeed;
        this.rightWheel += this.wheelSpeed;
      }
      //not spinning, and moving backwards
      if (this.spinning == 0 && this.moving == -1) {
        this.leftWheel -= this.wheelSpeed;
        this.rightWheel -= this.wheelSpeed;
      }
      //spinning Counter Clockwise, not moving forward
      else if (this.spinning == -1 && this.moving == 0) {
        this.leftWheel -= this.wheelSpeed;
        this.rightWheel += this.wheelSpeed;
      }
      //spinning Clockwise, not moving forward
      else if (this.spinning == 1 && this.moving == 0) {
        this.leftWheel += this.wheelSpeed;
        this.rightWheel -= this.wheelSpeed;
      }
      //spinning Counter Clockwise, moving forward
      else if (this.spinning == -1 && this.moving == 1) {
        this.leftWheel += 0.5 * this.wheelSpeed;
        this.rightWheel += this.wheelSpeed;
      }
      //spinning Clockwise, moving forward
      else if (this.spinning == 1 && this.moving == 1) {
        this.leftWheel += this.wheelSpeed;
        this.rightWheel += 0.5 * this.wheelSpeed;
      }
      //spinning Counter Clockwise, moving backwards
      else if (this.spinning == -1 && this.moving == -1) {
        this.leftWheel -= this.wheelSpeed;
        this.rightWheel -= 0.5 * this.wheelSpeed;
      }
      //spinning Clockwise, moving backwards
      else if (this.spinning == 1 && this.moving == -1) {
        this.leftWheel -= 0.5 * this.wheelSpeed;
        this.rightWheel -= this.wheelSpeed;
      }

      //prevent negative numbers with wheel spin counter
      if (this.leftWheel < 0) {
        this.leftWheel += 20;
      }
      if (this.rightWheel < 0) {
        this.rightWheel += 20;
      }
    }

    //drawing:
    push();

    translate(this.position.x, this.position.y);
    rotate(this.angle);

    push();
    if (this.alive == false) {
      // "Broken" state when dead!
      translate(1, -1);
      rotate(15);
    }
    fill(150, 150, 150);
    rect(-10, -10, 20, 4);
    if (this.alive == false) {
      // "Broken" state when dead!
      rotate(-15);
      rotate(-15);
      translate(-3, 2);
    }
    rect(-10, 6, 20, 4);
    if (this.alive == false) {
      // "Broken" state when dead!
      rotate(15);
    }

    for (var i = 0; i < 20; i = i + 4) {
      var posL = i + this.leftWheel;
      var posR = i + this.rightWheel;

      posL = posL % 20;
      posR = posR % 20;

      if (this.alive == false) {
        // "Broken" state when dead!
        translate(3, -2);
        rotate(15);
      }

      line(posL - 10, -10, posL - 10, -6);
      if (this.alive == false) {
        // "Broken" state when dead!
        rotate(-15);
        translate(-3, 2);
        rotate(-15);
      }
      line(posR - 10, 6, posR - 10, 10);
      if (this.alive == false) {
        // "Broken" state when dead!
        rotate(15);
      }
    }
    pop();

    fill(60, 60, 120);
    rect(-10, -6, 20, 12);

    push();
    if (this.alive == false) {
      // "Broken" state when dead!
      translate(-1, 2);
      rotate(30);
    }
    fill(80, 80, 150);
    square(-7, -6, 12);
    pop();

    push();
    if (this.alive == false) {
      // "Broken" state when dead!
      translate(2, 4);
      rotate(-45);
    }
    rect(5, -2, 10, 4);

    pop();

    pop();
  }

  move() {
    //move the bullets first!
    for (var i = 0; i < this.bullets.length; i++) {
      this.bullets[i].move();
      if (this.bullets[i].position.x > 400 || this.bullets[i].position.x < 0) {
        //if bullet leaves x border
        this.bullets.splice(i, 1); //destroy bullet
      } else if (
        this.bullets[i].position.y > 400 ||
        this.bullets[i].position.y < 0
      ) {
        //if bullet leaves x border
        this.bullets.splice(i, 1); //destroy bullet
      }
    }

    if (player.alive == true) {
      //only shoot and move if the player is alive!
      this.shoot();

      if (keyIsDown(LEFT_ARROW)) {
        //MOVE counter clockwise
        this.angle -= 2;
        this.velocity.setHeading((this.angle * PI) / 180);
        this.spinning = -1; //animate wheels turning
      }
      if (keyIsDown(RIGHT_ARROW)) {
        //MOVE clockwise
        this.angle += 2;
        this.velocity.setHeading((this.angle * PI) / 180);
        this.spinning = 1; //animate wheels turning
      }
      if (
        (!keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW)) ||
        (keyIsDown(LEFT_ARROW) && keyIsDown(RIGHT_ARROW))
      ) {
        //wheels dont turn if not turning
        this.spinning = 0;
      }

      if (keyIsDown(UP_ARROW)) {
        //MOVE forward
        this.position.add(this.velocity);
        this.moving = 1; //animate moving forward
      }
      if (keyIsDown(DOWN_ARROW)) {
        //MOVE backwards
        this.position.sub(this.velocity);
        this.moving = -1; //animate moving backwards
      }
      if (
        (!keyIsDown(UP_ARROW) && !keyIsDown(DOWN_ARROW)) ||
        (keyIsDown(UP_ARROW) && keyIsDown(DOWN_ARROW))
      ) {
        //wheels dont move if car isnt moving
        this.moving = 0;
      }
    }
  }

  //check for tank collision
  collision() {
    //check bullet collision first
    for (var j = 0; j < this.bullets.length; j++) {
      this.bullets[j].collision();
      if (this.bullets[j].hit == true) {
        //if bullet hits something, destroy the bullet
        this.bullets.splice(i, 1);
        i--;
      }
    }

    //check collision with enemies
    for (var i = 0; i < enemies.length; i++) {
      if (
        dist(
          this.position.x,
          this.position.y,
          enemies[i].position.x,
          enemies[i].position.y
        ) < 23
      ) {
        //if collision found:
        if (keyIsDown(UP_ARROW)) {
          //if moving forward, undo movement
          this.position.sub(this.velocity);
        }
        if (keyIsDown(DOWN_ARROW)) {
          //if moving backwards, undo movement
          this.position.add(this.velocity);
        }
      }
    }

    //prevent movement out of bounds
    if (this.position.x > 390) {
      this.position.x = 390;
    }
    if (this.position.x < 10) {
      this.position.x = 10;
    }
    if (this.position.y > 390) {
      this.position.y = 390;
    }
    if (this.position.y < 10) {
      this.position.y = 10;
    }
  }

  //shooting bullets
  shoot() {
    if (keyIsDown(32) && frameCount - this.lastShot > 60) {
      //if space is pressed and 1 second has passed:
      //print("!!!")
      this.lastShot = frameCount;

      //create a bullet that moves at the current angle, and is shifted to come out of the tank's barrel (for collision prevention with self)
      var offset = this.velocity.copy();
      offset = offset.normalize();
      offset = offset.mult(15);
      offset = offset.add(this.position);
      this.bullets.push(new Bullet(offset.x, offset.y, this.angle));
    }
  }
}
