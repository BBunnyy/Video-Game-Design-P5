//enemy tanks class: uses same structure as Tank!

class EnemyTank extends Tank {
  //AI tanks need extra information!
  xtra() {
    this.inLOS = false; //flag for if the tank is in a bullet's path

    //the states of the tank:
    this.states = [
      new ChasePlayer(),
      new ShootPlayer(),
      new DodgeBullets(),
      new Dead(),
      new Wander(),
    ];

    //slow enemy tanks a bit, so they are not stuttering while chasing player
    this.velocity.setMag(0.75);

    //default state is chasing
    this.state = 0;
    this.lastShot = 180; //prevent the enemies from shooting for 3 seconds at start
    this.bulletSpeed = 1.5; //edit the bullet speeds
    this.bulletRate = 120; //edit how often bullets can be shot (every 2 seconds)
  }

  //Draw enemeis!
  draw() {
    //draw bullets
    for (var j = 0; j < this.bullets.length; j++) {
      this.bullets[j].draw();
    }

    //ANIMATE THE TANKS MOVING!
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

    //prevent negative numbers with wheel spin
    if (this.leftWheel < 0) {
      this.leftWheel += 100;
    }
    if (this.rightWheel < 0) {
      this.rightWheel += 100;
    }

    //drawing the body:
    push(); //LINE 366

    translate(this.position.x, this.position.y);
    rotate(this.angle);

    push();
    if (this.alive == false) {
      translate(1, -1);
      rotate(15);
    }
    fill(150, 150, 150);
    rect(-10, -10, 20, 4);
    if (this.alive == false) {
      rotate(-15);
      rotate(-15);
      translate(-3, 2);
    }
    rect(-10, 6, 20, 4);
    if (this.alive == false) {
      rotate(15);
    }

    for (var i = 0; i < 20; i = i + 4) {
      var posL = i + this.leftWheel;
      var posR = i + this.rightWheel;

      posL = posL % 20;
      posR = posR % 20;

      if (this.alive == false) {
        translate(3, -2);
        rotate(15);
      }

      line(posL - 10, -10, posL - 10, -6);
      if (this.alive == false) {
        rotate(-15);
        translate(-3, 2);
        rotate(-15);
      }
      line(posR - 10, 6, posR - 10, 10);
      if (this.alive == false) {
        rotate(15);
      }
    }
    pop(); //LINE

    fill(120, 60, 60);
    rect(-10, -6, 20, 12);

    push(); //LINE 355
    if (this.alive == false) {
      translate(-1, 2);
      rotate(30);
    }
    fill(150, 80, 80);
    square(-7, -6, 12);
    pop(); //LINE 348

    push(); //LINE 364
    if (this.alive == false) {
      translate(2, 4);
      rotate(-45);
    }
    rect(5, -2, 10, 4);

    pop(); //LINE 357

    pop(); //LINE 298
    for (var i = 0; i < this.bullets.length; i++) {
      this.bullets[i].move();
    }
  }

  //move the tank
  move() {
    //move the tank
    this.position.add(this.velocity);

    //prevent the tanks for going out of bounds
    if (this.position.x < 10) {
      this.position.x = 10;
    }
    if (this.position.y < 10) {
      this.position.y = 10;
    }
    if (this.position.x > 390) {
      this.position.x = 390;
    }
    if (this.position.y > 390) {
      this.position.y = 390;
    }
  }

  //shooting control
  shoot() {
    //shoot at a defined rate only
    if (frameCount - this.lastShot > this.bulletRate) {
      //print("!!!")
      this.lastShot = frameCount;

      //spawn the bullets in front of the tank to prevent collision
      var offset = this.velocity.copy();
      offset = offset.normalize();
      offset = offset.mult(15);
      offset = offset.add(this.position);
      this.bullets.push(new Bullet(offset.x, offset.y, this.angle));
      this.bullets[this.bullets.length - 1].velocity.setMag(this.bulletSpeed);
    }
  }

  //check for collision
  collision() {
    //check if the bullet hits something or is out of bounds!
    for (var j = 0; j < this.bullets.length; j++) {
      this.bullets[j].collision();
      if (
        this.bullets[j].hit == true ||
        this.bullets[j].position.x > 400 ||
        this.bullets[j].position.y > 400 ||
        this.bullets[j].position.x < 0 ||
        this.bullets[j].position.y < 0
      ) {
        this.bullets.splice(j, 1); //destroy bullet
        j--;
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
        ) < 23 &&
        dist(
          this.position.x,
          this.position.y,
          enemies[i].position.x,
          enemies[i].position.y
        ) != 0
      ) {
        //if colliding with an enemy (with self collision prevention)
        this.position.sub(this.velocity); //undo last movement
      }
    }

    //check collision with player, only needed when player is dead!
    if (
      dist(
        this.position.x,
        this.position.y,
        player.position.x,
        player.position.y
      ) < 23 &&
      player.alive == false
    ) {
      this.position.sub(this.velocity);
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

  //check if the tank is in a bullets path!
  checkBulletPaths() {
    var inPath = false;

    //check if in path of player bullets!
    for (var i = 0; i < player.bullets.length; i++) {
      //check if in path
      var vec = p5.Vector.sub(this.position, player.bullets[i].position);
      var angle = (player.bullets[i].angle - (vec.heading() * 180) / PI) % 360;
      var y = vec.mag() * cos(angle);
      var x = vec.mag() * sin(angle);

      if (y > 0) {
        //object in front of bullet
        if (x > -15 && x < 15) {
          //in the path of the bullet, print that the tank is aware!
          push();
          translate(this.position.x, this.position.y);
          textSize(20);
          textStyle(BOLD);
          textAlign(CENTER);

          text("!", 0, -15);
          pop();

          inPath = true;

          //rotate to escape!
          var angleDiff =
            (player.bullets[i].velocity.angleBetween(this.velocity) * 180) / PI;

          //if on the left of the bullet's path
          if (x > 0) {
            //turn 30 degrees away from the bullet, before moving
            if (angleDiff > 90) {
              this.angle += 2;
              this.velocity.setHeading((this.angle * PI) / 180);
            } else if (angleDiff >= -180 && angleDiff < -150) {
              this.angle += 2;
              this.velocity.setHeading((this.angle * PI) / 180);
            } else if (angleDiff <= 90 && angleDiff > -30) {
              this.angle -= 2;
              this.velocity.setHeading((this.angle * PI) / 180);
            } else {
              this.move();
            }
          } else {
            //if on the right of the bullet's path
            //turn 30 degrees away from bullet's path, before moving
            if (angleDiff < -90) {
              this.angle -= 2;
              this.velocity.setHeading((this.angle * PI) / 180);
            } else if (angleDiff <= 180 && angleDiff > 150) {
              this.angle -= 2;
              this.velocity.setHeading((this.angle * PI) / 180);
            } else if (angleDiff >= -90 && angleDiff < 30) {
              this.angle += 2;
              this.velocity.setHeading((this.angle * PI) / 180);
            } else {
              this.move();
            }
          }
        }
      }
    }

    //check collision with enemy bullets, same as player's bullets algorithm
    for (var k = 0; k < enemies.length; k++) {
      for (var j = 0; j < enemies[k].bullets.length; j++) {
        //check if in path
        var vec1 = p5.Vector.sub(this.position, enemies[k].bullets[j].position);
        var angle1 =
          (enemies[k].bullets[j].angle - (vec1.heading() * 180) / PI) % 360;
        var y1 = vec1.mag() * cos(angle1);
        var x1 = vec1.mag() * sin(angle1);

        if (y1 > 0) {
          //object in front of bullet
          if (x1 > -15 && x1 < 15) {
            //in the path of the bullet
            //if facing the bullet:
            push();
            translate(this.position.x, this.position.y);
            textSize(20);
            textStyle(BOLD);
            textAlign(CENTER);

            text("!", 0, -15);
            pop();

            inPath = true;

            //rotate!
            var angleDiff1 =
              (enemies[k].bullets[j].velocity.angleBetween(this.velocity) *
                180) /
              PI;
            //print(angleDiff1)

            if (x1 > 0) {
              if (angleDiff1 > 90) {
                this.angle += 4;
                this.velocity.setHeading((this.angle * PI) / 180);
              } else if (angleDiff1 >= -180 && angleDiff1 < -150) {
                this.angle += 4;
                this.velocity.setHeading((this.angle * PI) / 180);
              } else if (angleDiff1 <= 90 && angleDiff1 > -30) {
                this.angle -= 4;
                this.velocity.setHeading((this.angle * PI) / 180);
              } else {
                this.move();
              }
            } else {
              if (angleDiff1 < -90) {
                this.angle -= 4;
                this.velocity.setHeading((this.angle * PI) / 180);
              } else if (angleDiff1 <= 180 && angleDiff1 > 150) {
                this.angle -= 4;
                this.velocity.setHeading((this.angle * PI) / 180);
              } else if (angleDiff1 >= -90 && angleDiff1 < 30) {
                this.angle += 4;
                this.velocity.setHeading((this.angle * PI) / 180);
              } else {
                this.move();
              }
            }
          }
        }
      }
    }
    return inPath;
  }
}
