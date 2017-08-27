[{
  id: '/#12wjbjsq872t2314',
  name: 'Abhi',
  room: 'Placio'
}]


// addUser(id,name,room)
// removeUser(id)
// getUser(id)
// getUserList(room)

class Users {
  constructor(){
    this.users=[];
  }

  addUser(id,name,room){
    var user={id,name,room};
    this.users.push(user);
    return user;
  }

  removeUser(id){
    var user = this.getUser(id);

    if(user){
      this.users = this.users.filter((user)=> user.id !== id);
    }
    return user;
    //return user that was removed
  }

  getUser(id){
    var user = this.users.filter((user)=>{
      return user.id === id;
    });
    return user[0];
  }

  getUserList(room){
    var users = this.users.filter((user)=>{
      return user.room === room;
    });
    var namesArray = users.map((user)=>{
      return user.name;
    });

    return namesArray;
  }
}

module.exports={Users};

// class Person{
//   constructor (name,age){
//     // console.log(name,age);
//     this.name=name;
//     this.age=age;
//   }
// }
//
// var me = new Person('Abhi',20);
