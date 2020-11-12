var app = require('express')();
var http = require('http').Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: [""],
    credentials: true
  }
});
var port = process.env.PORT || 3212;

var uid_ctr = 0;
var usernames = {};
var conns = new Map();
var chatlog_last200 = []

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


function emitOnline() {
  io.emit('online', Array.from(conns.values()));

}

io.on('connection', function(socket){


  socket.on('chat message', function(msg){
    msg["timestamp"] = (new Date()).toISOString();
    if (chatlog_last200.length >= 200) {
      chatlog_last200.shift();
    }
    chatlog_last200.push(msg);
    io.emit('chat message', msg);
  });

  socket.on('change uname', function(new_name) {
    let uid = conns.get(socket.id);
    usernames[uid] = {"name": new_name, "color": usernames[uid].color};
    io.emit('usernames', usernames);
  });

  socket.on('new uid', function() {
    let uid = ++uid_ctr;
    socket.emit('new uid', {"uid": uid, "username": socket.id});   // TODO: Gen random uname
    usernames[uid] = {"name": socket.id, "color": "white"}
    io.emit('usernames', usernames);
    conns.set(socket.id, {"id": uid, "name": socket.id, "color": "white"});
    emitOnline();
  });

  socket.on('post uid', function(uid){
    conns.set(socket.id, uid);  // TODO fix this..
    emitOnline();
  });

  socket.on('gimme chatlog', function(){
    socket.emit('here chatlog', chatlog_last200);
  });

  socket.on('disconnect', function(msg){
    if (conns.has(socket.id)) {
      conns.delete(socket.id);
      io.emit('online', Array.from(conns.values()));
    }
  });

});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
