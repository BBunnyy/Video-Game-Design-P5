//initialize elements
var player;
var enemies;
var points;
var counter;

function execEnemies() {
  for (var i = 0; i < enemies.length; i++) {
    enemies[i].states[enemies[i].state].execute(i);
    enemies[i].collision();
  }
}

//end screen animation:
function drawEndScreen(color) {
  push();
  //translate(-200,-200)

  push();
  translate(200, 200);
  fill(color);
  quad(-120, -30, 120, -30, 80, -60, -80, -60);
  rect(30, -90, 100, 20);
  quad(-80, -60, 50, -60, 30, -100, -70, -100);
  pop();

  push();

  translate(200, 200);
  noStroke();
  fill(70);
  rect(-90, -40, 180, 80);

  pop();

  //left circle!
  push();

  translate(110, 200);
  fill(70);
  noStroke();
  circle(0, 0, 80);
  fill(130);
  if (count > 180) {
    count = 0;
  }
  rotate(count);
  for (var u = 0; u < 20; u++) {
    if (u * 18 + count >= 180 && u * 18 + count < 360) {
      rotate(u * 18);

      rect(-2, -40, 4, 10);

      rotate(-u * 18);
    }
  }
  pop();

  //Right circle!
  push();

  translate(290, 200);
  noStroke();
  fill(70);
  circle(0, 0, 80);
  fill(130);
  if (count > 180) {
    count = 0;
  }
  rotate(count);
  for (var v = 0; v < 20; v++) {
    if (v * 18 + count <= 180 || v * 18 + count >= 360) {
      rotate(v * 18);

      rect(-2, -40, 4, 10);

      rotate(-v * 18);
    }
  }
  pop();

  push();

  translate(200, 200);
  fill(130);
  noStroke();
  for (var l = 0; l < 20; l++) {
    var position = l * 10 + (10 * count) / 18;
    position = position % 180;
    rect(-92 + position, -40, 4, 10);
    rect(88 - position, 40, 4, -10);
  }

  pop();

  //outlines:
  push();
  translate(200, 200);
  noFill();
  arc(-90, 0, 80, 80, 90, 270);
  arc(-90, 0, 60, 60, 90, 270);
  arc(90, 0, 80, 80, 270, 90);
  arc(90, 0, 60, 60, 270, 90);
  line(-90, -40, 90, -40);
  line(-90, -30, 90, -30);
  line(-90, 40, 90, 40);
  line(-90, 30, 90, 30);
  pop();

  push();
  fill(255);
  for (var o = 0; o < 4; o++) {
    translate(110 + o * 60, 200);
    rotate(count);
    fill(180);
    circle(0, 0, 60);
    fill(150);
    circle(0, 0, 52);
    fill(180);
    circle(0, 0, 20);
    for (var p = 0; p < 6; p++) {
      rotate(60 * p);
      translate(7, 0);
      fill(100);
      circle(-2, 0, 3);
      line(18, 3, 8, 5);
      line(18, -3, 8, -5);
      noFill();
      arc(8, 8.65, 7, 7, 160, 260);
      //rect(0,0,20,0)
      translate(-7, 0);
      rotate(-60 * p);
    }

    rotate(-count);
    translate(-110 - o * 60, -200);
  }
  pop();

  pop();
  count++;
}

function setup() {
  angleMode(DEGREES);
  createCanvas(400, 400);
  //create player, facing down
  player = new Tank(200, 200);
  player.angle = 90;
  player.velocity.setHeading((player.angle * PI) / 180);

  //create enemies!
  enemies = [];
  enemies.push(new EnemyTank(25, 200));

  var temp = new EnemyTank(375, 200);
  temp.angle = 180;
  temp.velocity.setHeading((temp.angle * PI) / 180);
  enemies.push(temp);

  temp = new EnemyTank(200, 25);
  temp.angle = 90;
  temp.velocity.setHeading((temp.angle * PI) / 180);
  enemies.push(temp);

  temp = new EnemyTank(175, 375);
  temp.angle = 180;
  temp.velocity.setHeading((temp.angle * PI) / 180);
  enemies.push(temp);

  enemies.push(new EnemyTank(225, 375));

  //initialize points
  points = 0;
  //initialize counter for end animation
  count = 0;
}

function draw() {
  background(170, 230, 170);

  push();
  textSize(20);
  fill(0, 0, 255);
  var str1 = "Score: ";
  str1 = str1.concat(points);
  text(str1, 0, 20);
  pop();

  //draw objects:
  player.draw();
  for (var i = 0; i < enemies.length; i++) {
    enemies[i].draw();
  }

  //move objects:
  player.move();
  execEnemies();
  player.collision();

  //end game cases: win or lose
  if (player.alive == false) {
    //lose if dead
    drawEndScreen([120, 60, 60]);
    push();
    translate(200, 300);
    textAlign(CENTER);
    textStyle(BOLD);
    textSize(50);
    stroke(0);
    strokeWeight(5);
    fill([180, 120, 120]);
    text("GAME OVER!", 0, 0);
    pop();
  } else if (points == enemies.length) {
    //win if all enemies are killed
    drawEndScreen([60, 60, 120]);
    push();
    translate(200, 300);
    textAlign(CENTER);
    textStyle(BOLD);
    textSize(50);
    stroke(0);
    strokeWeight(5);
    fill([120, 120, 180]);
    text("YOU WIN!", 0, 0);
    pop();
  }
}
