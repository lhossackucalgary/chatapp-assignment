var app = require('express')();
var http = require('http').Server(app);
const fs = require('fs');
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: [""],
    credentials: true
  }
});
var port = process.env.PORT || 9000;

var uid_ctr = 0;
var usernames = {};
var conns = new Map();
var chatlog_last200 = []

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/:x/:y', function(req,res) {
  res.sendFile(__dirname + `/${req.params['x']}/${req.params['y']}`);
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
    conns_array = Array.from(conns.values())

    let unique = true;
    for (let i = 0; i < conns_array.length; i++) {
      if (conns_array[i].name === new_name) {
        unique = false;
        break;
      }
    }

    if (!unique) {
      socket.emit('command failed', {'reason': 'non-unique username'});
      return;
    } else if (new_name.length > 20) {
      socket.emit('command failed', {'reason': 'name too long'});
      return;
    } else {
      let prev = conns.get(socket.id);
      let uid = prev.id;
      let color = prev.color;
      conns.set(socket.id, {"id": uid, "name": new_name, "color": color});
      usernames[uid] = {"name": new_name, "color": color};
      io.emit('usernames', usernames);
      emitOnline();
    }
  });

  socket.on('change color', function(new_color) {
    if (!/[0-9A-Fa-f]{6}/gi.test(new_color)) {
      socket.emit('command failed', {'reason': 'invalid color. Format: RRGGBB (hex)'});
      return;
    } else {
      let prev = conns.get(socket.id);
      let uid = prev.id;
      let name = prev.name;
      usernames[uid] = {"name": name, "color": `#${new_color}`};
      conns.set(socket.id, {"id": uid, "name": name, "color": `#${new_color}`});
      io.emit('usernames', usernames);
      emitOnline();
    }
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
    let name = "";
    let color = "ffffff";
    if (uid in usernames) {
      let old = usernames[uid];
      conns_array = Array.from(conns.values())
      let unique = true;
      for (let i = 0; i < conns_array.length; i++) {
        if (conns_array[i].name === old.name) {
          unique = false;
          break;
        }
      }
      if (unique) {
        name = old.name;
      } else {
        name = socket.id;
      }
      color = old.color
    } else {
      name = socket.id;
      color = "ffffff";
    }
    conns.set(socket.id, {"id": uid, "name": name, "color": color});
    usernames[uid] = {"name": name, "color": color}
    io.emit('usernames', usernames);
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
