var socket=io();

socket.on('connect',function(){
  console.log('Connected to server');
});

socket.on('disconnect',function(){
  console.log('Disconnected from server');
});

socket.on('newMessage', function(msg){
  console.log('New message on chat app',msg);

  var li=jQuery('<li></li>');
  li.text(`${msg.from}: ${msg.text}`);

  jQuery('#messages').append(li);
});


jQuery('#msg-form').on('submit',function(e){
  e.preventDefault();

  socket.emit('createMessage',{
    from:'user',
    text: jQuery('[name=msg-box]').val()
  },function(){

  });

});
