const path= require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath= path.join(__dirname,'../public');
const port=process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
  console.log('New User Connected');

  socket.emit('newMessage',{
    from: 'Abhi',
    text: 'Can we meet up?',
    createdAt: new Date().getTime()
  });

  socket.on('createMessage',(msg)=>{
    console.log('Message: ',msg);
  })

  socket.on('disconnect',()=>{
    console.log('User was disconnected');
  });
});

server.listen(port,()=>{
  console.log(`Server is up on ${port}`);
});
