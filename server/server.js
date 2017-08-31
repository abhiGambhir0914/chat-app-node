const path= require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {Rooms} = require('./utils/rooms.js');
const {generateMessage,generateLocationMessage}=require('./utils/message.js');
const {isRealString}=require('./utils/validation.js');
const {Users}=require('./utils/users.js');

const publicPath= path.join(__dirname,'../public');
const port=process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();
var rooms = new Rooms();

var updateRooms = function(){
  rooms.rooms.forEach(function(r){
    var listed = users.getUserList(r.name);
    // console.log(`Users listed in ${r.name}: `,listed);
    if(listed){
      if(listed.length === 0) return rooms.removeRoom(r);
    }
  });
}

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
  // console.log(`New User Connected: ${socket.id}\n`);

  socket.emit('updateRoomsList',rooms.getRoomsList());

  updateRooms();
  // console.log('Updated ROOMS List from Server io.on(connection)\n\n');

  // socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app!!'));
  // socket.broadcast.emit('newMessage',generateMessage('Admin','New user joined'));

 //listening to joining page
  socket.on('join',(params,callback)=>{
    if(!isRealString(params.name) || !isRealString(params.room)){
      return callback('Name and room name are required.');
    }

    // console.log('PARAMS at LOGIN: ',params.name,params.room);
    var name = params.name;
    var taken = false;
    var room = params.room.toLowerCase();
    taken = users.users.filter((user)=> user.name===name && user.room===room);
    if(taken.length > 0){
      return callback('Display Name already exists in that Chat Room');
    }
    // console.log(taken);

    var boo= rooms.rooms.filter((ro)=> ro.name === room);
    if(boo.length===0){
      rooms.addRoom(room);
      socket.emit('updateRoomList',rooms.getRoomsList());
    }
    socket.join(room);

    // socket.join(params.room.toLowerCase());
    //socket.leave('Room Name');
    users.removeUser(socket.id);
    users.addUser(socket.id,params.name,room);

    io.to(room).emit('updateUserList',users.getUserList(room));
    //io.emit -> io.to('Room Naem').emit
    //socket.broadcast.emit -> socket.broadcast.to('Room Name').emit
    //socket.emit
    socket.emit('newMessage',generateMessage(`Admin`,`Hello ${params.name}, welcome to the ${room} room.`));
    socket.broadcast.to(room).emit('newMessage',generateMessage('Admin',`${params.name} has joined.`));

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
    // console.log(`CLIENT: ${socket.id} was DISCONNECTED from server`);
    var user=users.removeUser(socket.id);

    if(user){
      room=user.room;
      io.to(user.room.toLowerCase()).emit('updateUserList',users.getUserList(user.room.toLowerCase()));
      io.to(user.room.toLowerCase()).emit('newMessage',generateMessage('Admin',`${user.name} has left`));
      updateRooms();
    }
  });
});

server.listen(port,()=>{
  console.log(`Server is up on ${port}`);
});
