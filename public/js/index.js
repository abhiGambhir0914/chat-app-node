var socket=io();
var template=jQuery('#open-rooms-template').html();
const noMessage = 'No Available Chat Rooms';

jQuery('#open-rooms-template').on('submit', function(eventArgument){
  eventArgument.preventDefault();
  var comboBox=jQuery('[name=chatrooms]');

  socket.emit('createMessage',{

    text:msgTextbox.val()
  },function(){
    msgTextbox.val('');
  });
});








socket.on('updateRoomList',function(rooms){
  // console.log('ROOMS List: ',rooms);
  var ol = jQuery('<ol></ol>');
  rooms.forEach(function(room){
    // console.log(room);
    ol.append(jQuery('<li></li>').text(room.name));



    // console.log('ROOM trying to be updated: ',room);
    addToDropBox(room.name);
  });
  jQuery('#rooms').html(ol);
});

function addToDropBox(room){
  var x = document.getElementById("open-rooms");
  var option = document.createElement("option");
  option.text = room;
  // console.log('ROOM trying to be updated: ',option);
  x.add(option);
  if(room != noMessage){
    var option=document.createElement("option");
    option.text=noMessage;
    x.remove(option);
  }
}

function onSelectedChanged(){
  var selectBox=document.getElementById('open-rooms');

  if(selectBox.value != noMessage){
    document.getElementById('room-text').value = (document.getElementById('open-rooms').value);
    // console.log(selectBox.value);
  }
}

function loadDropDown(){
  // console.log('DROPDOWN menu was loaded');
  if(document.getElementById('open-rooms').value.length === 0){
    // console.log('DROPDOWN menu value is ZERO');
    this.addToDropBox(noMessage);
  }else{
    this.onSelectedChanged();
  }
}

// console.log('THE INDEX.JS FILE WAS RUN');
