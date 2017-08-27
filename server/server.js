const path= require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage,generateLocationMessage}=require('./utils/message.js');
const {isRealString}=require('./utils/validation.js');
const {Users}=require('./utils/users.js');

const publicPath= path.join(__dirname,'../public');
const port=process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
  console.log('New User Connected');

  // socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app!!'));
  // socket.broadcast.emit('newMessage',generateMessage('Admin','New user joined'));

 //listening to joining page
  socket.on('join',(params,callback)=>{
    if(!isRealString(params.name) || !isRealString(params.room)){
      return callback('Name and room name are required.');
    }
    socket.join(params.room.toLowerCase());
    //socket.leave('Room Name');
    users.removeUser(socket.id);
    users.addUser(socket.id,params.name,params.room.toLowerCase());

    io.to(params.room.toLowerCase()).emit('updateUserList',users.getUserList(params.room.toLowerCase()));
    //io.emit -> io.to('Room Naem').emit
    //socket.broadcast.emit -> socket.broadcast.to('Room Name').emit
    //socket.emit
    socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app!!'));
    socket.broadcast.to(params.room.toLowerCase()).emit('newMessage',generateMessage('Admin',`${params.name} has joined.`));

    // callback();
  });


  socket.on('createMessage',(msg,callback)=>{
    var user = users.getUser(socket.id);

    if(user && isRealString(msg.text)){
      io.to(user.room.toLowerCase()).emit('newMessage',generateMessage(user.name,msg.text));
    }

    callback('');
    // socket.broadcast.emit('newMessage',{
    //   from: msg.from,
    //     text: msg.text,
    //     createdAt: new Date().getTime()
    // });
});

  socket.on('createLocMsg',(coords)=>{
    var user = users.getUser(socket.id);

    if(user){
      io.to(user.room.toLowerCase()).emit('newLocationMessage',generateLocationMessage(user.name,coords.latitude,coords.longitude));
    }
  });

  socket.on('disconnect',()=>{
    // console.log('User was disconnected');
    var user=users.removeUser(socket.id);

    if(user){
      io.to(user.room.toLowerCase()).emit('updateUserList',users.getUserList(user.room.toLowerCase()));
      io.to(user.room.toLowerCase()).emit('newMessage',generateMessage('Admin',`${user.name} has left`));
    }
  });
});

server.listen(port,()=>{
  console.log(`Server is up on ${port}`);
});
