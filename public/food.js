function Food(x, y, img) {
  this.x = x;
  this.y = y;
  this.eaten = function() {
    blobs.forEach(function (enemy) {
      var d = createVector(x, y).dist(createVector(enemy.x, enemy.y));
      if (d < 40 + enemy.r) {
        socket.emit("removeme", x);
        blob.r+=.1;
      }
    });
  }
  this.show = function() {
    image(brushes[img], this.x, this.y, 40, 40);
  }
}
