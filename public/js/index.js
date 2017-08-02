var socket=io();

socket.on('connect',function(){
  console.log('Connected to server');
});

socket.on('disconnect',function(){
  console.log('Disconnected from server');
});

socket.on('newMessage', function(msg){
  console.log('New message on chat app',msg);

  var li=jQuery('<li></li>');            //imp
  li.text(`${msg.from}: ${msg.text}`);   //imp

  jQuery('#messages').append(li);        //imp
});


socket.on('newLocationMessage',function(msg){
  var li=jQuery('<li></li>');
  var a=jQuery('<a target="_blank">My location</a>');

  li.text(`${msg.from}: `);
  a.attr('href',msg.url);
  li.append(a);

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

var locationVar=jQuery('#send-location');
locationVar.on('click',function(){
    if(!navigator.geolocation){
      return alert('Geolocation is not supported by your browser');
    }

    navigator.geolocation.getCurrentPosition(function(position){
      socket.emit('createLocMsg',{
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },function(){
      alert('Unable to fetch location');
    });
});
