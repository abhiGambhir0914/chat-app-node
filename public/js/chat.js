var socket=io();

let countMsg = 0;
function isElementOutViewport (el) {
  if (typeof jQuery !== 'undefined' && el instanceof jQuery)
    el = el[0];
  const rect = el.getBoundingClientRect();
  // console.log(rect.top);
  // console.log(window.innerHeight);
  return rect.bottom < 0 || rect.right < 0 || rect.left > window.innerWidth || rect.top > window.innerHeight;
}

function scrollToBottom(fullscroll){
  //Selectors
  var messages=jQuery('#messages');
  var newMessage=messages.children('li:last-child');

  if (isElementOutViewport(newMessage)) {
    countMsg++;
    const template = jQuery('#newMsg-template').html();
    const html = Mustache.render(template,{countMsg});
    jQuery('#messages-preview').html(html);
  }
  //Heights
  var scrollTop = messages.prop('scrollTop');
  var clientHeight=messages.prop('clientHeight');
  var scrollHeight=messages.prop('scrollHeight');
  var newMessageHeight=newMessage.innerHeight();
  var lastMessageHeight=newMessage.prev().innerHeight();

  // console.log(scrollHeight)

  if((scrollTop + clientHeight + newMessageHeight +lastMessageHeight)>=scrollHeight){
      messages.scrollTop(scrollHeight);
  }
  if (fullscroll) {
   messages.scrollTop(scrollHeight);
   countMsg = 0;
   // hide the button
   const countbutton = jQuery('#divCheckbox');
  //  console.log(countbutton)
   countbutton.remove();
 }
}

socket.on('connect',function(){
  // console.log('Connected to server');
  var params=jQuery.deparam(window.location.search);
  // console.log(params);

  socket.emit('join',params,function(err){
    if(err){
      alert(err);
      window.location.href='/';
    }
    else{
      console.log('No error');
    }
  });
});

socket.on('updateUserList',function(users){
  // console.log('Users list: ',users);
  var ul=jQuery('<ul></ul>');

  users.forEach(function(user){
    ul.append(jQuery('<li></li>').text(user)); //user.name?????
  });
  jQuery('#users').html(ul);
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
    },function(err){
      locationVar.removeAttr('disabled').text('Send location');
      alert(`Unable to fetch location >> ${err.code}): ${err.message}`);
      // alert('Unable to fetch location');
    });
});
