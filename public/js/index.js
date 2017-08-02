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

  var msgTextbox=jQuery('[name=msg-box]');
  socket.emit('createMessage',{
    from:'user',
    text: msgTextbox.val()
  },function(){
    msgTextbox.val('');
  });
});

var locationVar=jQuery('#send-location');
locationVar.on('click',function(){
    if(!navigator.geolocation){
      return alert('Geolocation is not supported by your browser');
    }

    locationVar.attr('disabled','disabled').text('Sending...');

    navigator.geolocation.getCurrentPosition(function(position){
      locationVar.removeAttr('disabled').text('Send location');
      socket.emit('createLocMsg',{
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },function(){
      locationVar.removeAttr('disabled').text('Send location');
      alert('Unable to fetch location');
    });
});
