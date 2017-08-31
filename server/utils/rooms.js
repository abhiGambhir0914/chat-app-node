//ES6 Classes
var {isRealString} = require('./validation.js');
class Rooms{
  constructor(){
    this.rooms=[];
  }
  isTaken(name){
    var list = this.rooms.filter((room)=>room.name === name);
    if(list.length > 0){
      return true;
    }
    return false;
  }
  addRoom(name){
    var message = "";
    if(isRealString(name)){
      if(this.isTaken(name)===false){
        var room={
          name: name
        }
        this.rooms.push(room);
        return room;
      }else{
        message = 'Room is Taken';
      }
    }
    return message;
  }
  getRoomsList(){
    // console.log(this.rooms);
    return this.rooms;
  }

  getRoom(name){
    var matches = this.rooms.filter(function(r){
      r.name === name
    });
    if(matches.length > 0){
      return matches[0];
    }
    return undefined;
  }

  roomIsEmpty(room){
    var gotRoom = this.getRoom(room);
    var userList;
    if(gotRoom != undefined){
      userList = getUserList(gotRoom);
    }else{
      console.log(room,'Chat Room does not exist');
    }
    // console.log(`Is ${gotRoom} empty?`);
    if(userList && userList.length > 0) return false;
    else return true;
  }
  //REMOVE=================================
  removeRoom(name){
    //return the object after you remove it from the list
    var gotRoom = this.rooms.filter(function(ro){
      return ro.name === name.name;
    });
  //  console.log(this.rooms);
  //  console.log('ROOM to be REMOVED: ',gotRoom);
   var room;
   if(!gotRoom.length > 0){
     console.log('\tChatRoom(${name.name}) NOT FOUND -- could NOT return a ChatRoom');
     return undefined;
   }
   room = gotRoom[0];
   var index = this.rooms.indexOf(room);
  //  console.log(room,index);
   this.rooms.splice(index,1);
  //  console.log(this.rooms);
   return room;
  }
}

module.exports = {Rooms};
