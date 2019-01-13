function Food(x, y, img) {
  this.x = x;
  this.y = y;
  this.eaten = function() {
    var d = createVector(x, y).dist(createVector(blob.pos.x, blob.pos.y));
    if (d < 40 + blob.r) {
      socket.emit("removeme", x);
      blob.r+=..01;
    }
  }
  this.show = function() {
    image(brushes[img], this.x, this.y, 40, 40);
  }
}
