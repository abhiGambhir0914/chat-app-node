var socket=io();

function scrollToBottom(){
  //Selectors
  var messages=jQuery('#messages');
  var newMessage=messages.children('li:last-child');
  //Heights
  var scrollTop = messages.prop('scrollTop');
  var clientHeight=messages.prop('clientHeight');
  var scrollHeight=messages.prop('scrollHeight');
  var newMessageHeight=newMessage.innerHeight();
  var lastMessageHeight=newMessage.prev().innerHeight();

  if((scrollTop + clientHeight + newMessageHeight +lastMessageHeight)>=scrollHeight){
      messages.scrollTop(scrollHeight);
  }
}

socket.on('connect',function(){
  console.log('Connected to server');
});

socket.on('disconnect',function(){
  console.log('Disconnected from server');
});

socket.on('newMessage', function(msg){
  var formattedTime=moment(msg.createdAt).format('h:mm a');

  var template = jQuery('#message-template').html();
  var html=Mustache.render(template,{
    text: msg.text,
    from: msg.from,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();

  // var li=jQuery('<li></li>');            //imp
  // li.text(`${msg.from} ${formattedTime}: ${msg.text}`);   //imp
  //
  // jQuery('#messages').append(li);        //imp
});


socket.on('newLocationMessage',function(msg){
  var formattedTime=moment(msg.createdAt).format('h:mm a');

  var template=jQuery('#location-message-template').html();
  var html=Mustache.render(template,{
    from:msg.from,
    url:msg.url,
    createdAt:formattedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();

  // var li=jQuery('<li></li>');
  // var a=jQuery('<a target="_blank">My location</a>');
  //
  // li.text(`${msg.from} ${formattedTime}: `);
  // a.attr('href',msg.url);
  // li.append(a);
  //
  // jQuery('#messages').append(li);
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
