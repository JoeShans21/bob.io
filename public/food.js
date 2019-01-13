function Food(x, y, img) {
  this.x = x;
  this.y = y;
  this.eaten = function() {
    var d = createVector(x, y).dist(createVector(blob.x, blob.y));
    if (d < 40 + enemy.r) {
      socket.emit("removeme", x);
      blob.r+=.1;
    }
  }
  this.show = function() {
    image(brushes[img], this.x, this.y, 40, 40);
  }
}
