const path= require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage,generateLocationMessage}=require('./utils/message.js');
const {isRealString}=require('./utils/validation.js');
const publicPath= path.join(__dirname,'../public');
const port=process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
  console.log('New User Connected');

 //listening to joining page
  socket.on('join',(params,callback)=>{
    if(!isRealString(params.name) || !isRealString(params.room)){
      callback('Name and room name are required.');
    }
    // callback();
  });

  socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app!!'));

  socket.broadcast.emit('newMessage',generateMessage('Admin','New user joined'));

  socket.on('createMessage',(msg,callback)=>{
    console.log('Message: ',msg);
    io.emit('newMessage',generateMessage(msg.from,msg.text));
    callback('');
    // socket.broadcast.emit('newMessage',{
    //   from: msg.from,
    //     text: msg.text,
    //     createdAt: new Date().getTime()
    // });
});

  socket.on('createLocMsg',(coords)=>{
    io.emit('newLocationMessage',generateLocationMessage('User',coords.latitude,coords.longitude));
  });

  socket.on('disconnect',()=>{
    console.log('User was disconnected');
  });
});

server.listen(port,()=>{
  console.log(`Server is up on ${port}`);
});
