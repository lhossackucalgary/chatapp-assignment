import io from 'socket.io-client';
var socket = io('localhost:3212');

socket.on('connect', () => {
  console.log(socket.connected);
});

socket.on('connect_error', () => {
  console.log('conection err')
  setTimeout(() => {
    socket.connect();
  }, 2000);
});

export default socket;
