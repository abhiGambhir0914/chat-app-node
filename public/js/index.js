var socket=io();

socket.on('connect',function(){
  console.log('Connected to server');

  socket.emit('createMessage',{
    to: 'Raunak',
    text: 'I am a bit busy today'
  });
});

socket.on('disconnect',function(){
  console.log('Disconnected from server');
});

socket.on('newMessage', function(msg){
  console.log('New message on chat app',msg);
});
