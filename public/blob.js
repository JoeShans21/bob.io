function Blob(user, x, y, r) {
  this.pos = createVector(x, y);
  this.r = r;
  this.user = user;
  this.vel = createVector(0, 0);

  this.update = function() {
    var newvel = createVector(mouseX-window.innerWidth/2, mouseY-window.innerHeight/2);
    newvel.setMag(100/this.r+.5);
    this.vel.lerp(newvel, .2);
    this.pos.add(this.vel);
  }

  this.eats = function(other) {
    var d = this.pos.dist(createVector(other.x, other.y));
    if (d < this.r + other.r) {
      var sum = PI * this.r * this.r + PI * other.r * other.r;
      this.r = sqrt(sum/PI);
      return true;
    } else {
      return false;
    }
  }
  var blobseaten = [];
  this.eatsblob = function(enemy) {
    var d = this.pos.dist(createVector(enemy.x, enemy.y));
    if (d < this.r + enemy.r) {
      console.log(this.r, enemy.r);
      console.log(blobseaten);
      if (this.r > enemy.r) {
        if (!blobseaten.includes(enemy.user)) {
          var sum = PI * this.r * this.r + PI * enemy.r * enemy.r;
          this.r = sqrt(sum/PI);
          blobseaten.push(enemy.user);
          return 0;
        }
      }
      else if (this.r == enemy.r) {
        return 1;
      }
      else {
        return 2;
      }
    }
  }

  this.constrain = function() {
    this.pos.x = constrain(this.pos.x, -mapWidth+this.r, mapWidth-this.r);
    blob.pos.y = constrain(this.pos.y, -mapHeight+this.r, mapHeight-this.r);
  }

  this.show = function() {
    imageMode(CENTER);
    image(bob, this.pos.x, this.pos.y, this.r*2, this.r*2);
    //fill(255);
    //ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);
  }
}
