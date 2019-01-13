var socket;
var blob;
var blobs = [];
var foods = [];
var zoom = 1;
var input;
var button;
var started = false;
var mapWidth = 700;
var mapHeight = 700;
var bob;
var brushes = [];
var local=true;
function preload() {
  bob = loadImage('images/bob.png');
  for (var i = 0; i < 4; i++) {
    brushes[i] = loadImage('images/brush' + i + '.png');
  }
}
function setup() {
  usernameselect();
}
function usernameselect() {
  createCanvas(window.innerWidth, window.innerHeight);
  if (local==true){
    socket = io.connect('http://192.168.1.46:3000/');
  }
  else {
    socket = io.connect('https://bobio.herokuapp.com/');
  }
  input = createInput();
  input.position(window.innerWidth/2-100, window.innerHeight/2-30);
  button = createButton('submit');
  button.position(input.x + input.width, window.innerHeight/2-30);
  button.mousePressed(game);
}
function game() {
  blob = new Blob(input.value(), random(mapWidth), random(mapHeight), 50);
  removeElements();
  started = true;
  document.getElementById("score").hidden = false;
  var data = {
    user: blob.user,
    x: blob.pos.x,
    y: blob.pos.y,
    r: blob.r
  };
  socket.emit('start', data);
  socket.on('heartbeat',
    function(data) {
      blobs = data[0];
      foods = data[1];
    }
  );
}
function draw() {
  if (started){
    document.getElementById('score').innerHTML = Math.round(blob.r)-50;
    background(0, 255, 0);
    translate(window.innerWidth/2, window.innerHeight/2);
    var newzoom = 64/blob.r;
    zoom = lerp(zoom, newzoom, 0.05);
    scale(zoom);
    translate(-blob.pos.x, -blob.pos.y);
    line (-mapWidth, mapHeight, -mapWidth, -mapHeight);
    line (mapWidth, mapHeight, mapWidth, -mapHeight);
    line (-mapWidth, -mapHeight, mapWidth, -mapHeight);
    line (-mapWidth, mapHeight, mapWidth, mapHeight);
    console.log(blobs);
    for (var i = blobs.length-1; i >= 0; i--) {
      if (blobs[i].user !== blob.user) {
        //fill(0, 0, 255);
        //ellipse(blobs[i].x, blobs[i].y, blobs[i].r*2, blobs[i].r*2);
        imageMode(CENTER);
        image(bob, blobs[i].x, blobs[i].y, blobs[i].r*2, blobs[i].r*2);
        var res = blob.eatsblob(blobs[i]);
        if (res==2) {
          started = false;
          socket.disconnect();
          alert(blobs[i].user + " ate you!")
        }
      }
    }
    for (var i = 0; i < foods.length; i++) {
      //fill(255, 0, 0);
      //ellipse(foods[i].x, foods[i].y, foods[i].r*2, foods[i].r*2);
      //floor(random(0, 4))
      image(brushes[foods[i].img], foods[i].x, foods[i].y, 40, 40);
      if (blob.eats(foods[i])) {
        foods.splice(i, 1);
        socket.emit('removefood', i);
      }
    }
    blob.show();
    blob.update();
    blob.constrain();
    var data = {
      user: blob.user,
      x: blob.pos.x,
      y:blob.pos.y,
      r:blob.r
    };
    socket.emit('update', data);
  }
}
function windowResized() {
  if (started == false){
    input.position(window.innerWidth/2-100, window.innerHeight/2-30);
    button.position(input.x + input.width, window.innerHeight/2-30);
  }
  resizeCanvas(window.innerWidth, window.innerHeight);
}
