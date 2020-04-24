var blobs = [];
var foods = [];
var mapWidth = 700;
var mapHeight = 700;
function Blob(user, x, y, r) {
  this.user = user;
  this.x = x;
  this.y = y;
  this.r = r;
}
function Food(x, y, img) {
  this.x = x;
  this.y = y;
  this.img = img;
}
for (var i=0; i < 70; i++) {
  var food = new Food((Math.random() * mapWidth * 2)-mapWidth, (Math.random() * mapHeight * 2)-mapHeight, Math.floor(Math.random()*4));
  foods.push(food);
}
var express = require('express');
var app = express();
var local=true;
if (local==true){
  var server = app.listen(2121, "0.0.0.0");
}
else {
  var server = app.listen(process.env.PORT || 8080);
}
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}
app.use('/game', express.static('public'));
var io = require('socket.io')(server);
setInterval(heartbeat, 33);
function heartbeat() {
  io.sockets.emit('heartbeat', [blobs, foods]);
}
io.sockets.on('connection',
  function (socket) {
    console.log("We have a new client: " + socket.id);
    var disconnectname;
    socket.on('start',
      function(data) {
        var blob = new Blob(data.user, data.x, data.y, data.r);
        disconnectname = data.user;
        blobs.push(blob);
      }
    );
    var updating = true;
    socket.on('update',
      function(data) {
        if (updating) {
          var blob;
          for (var i = 0; i < blobs.length; i++) {
            if (data.user == blobs[i].user) {
              blob = blobs[i];
            }
          }
          if (blob == null){
            socket.emit("disconnectme");
          }
          else {
            blob.x = data.x;
            blob.y = data.y;
            blob.r = data.r;
          }
        }
      }
    );
    socket.on('removeme',
      function (myx) {
        foods.forEach(function (element){
          if (element.x == myx) {
            foods.splice(foods.indexOf(element), 1);
            var food = new Food((Math.random() * mapWidth * 2)-mapWidth, (Math.random() * mapHeight * 2)-mapHeight, Math.floor(Math.random()*4));
            foods.push(food);
          }
        })
      }
    );
    socket.on('checkuser',
      function (recieveduser) {
        console.log("checking user");
        var valid = true;
        for (var i = 0; i < blobs.length; i++) {
          if (recieveduser == blobs[i].user) {
            valid = false;
          }
        }
        socket.emit("validateuser", valid);
      }
    );
    socket.on('disconnect', function() {
      blobs.forEach(function(element) {
        if (disconnectname == element.user) {
          blobs.splice(blobs.indexOf(element.user), 1);
          updating = false;
        }
      });
    });
  }
);
