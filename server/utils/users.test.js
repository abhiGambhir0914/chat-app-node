const expect= require('expect');

const {Users}= require('./users.js');

describe('Users',()=>{
  var users;

  beforeEach(()=>{
    users = new Users();
    users.users=[{
      id: '1',
      name: 'Abhi',
      room: 'room1'
    },{
      id: '2',
      name: 'Kashish',
      room: 'room5'
    },{
      id: '3',
      name: 'Ram',
      room: 'room1'
    }];
  });


  it('should add new user',()=>{
    var users=new Users();
    var user={
      id:'1234',
      name:'Abhi',
      room:'placio'
    };
    var resUser= users.addUser(user.id,user.name,user.room);

    expect(users.users).toEqual([user]);
  });

  it('should remove user',()=>{
    var userData = users.removeUser('1');
    expect(userData.id).toBe('1');
    expect(users.users.length).toBe(2);
  });

  it('should not remove user',()=>{
    var userInvalidData = users.removeUser('12342');
    expect(userInvalidData).toNotExist();
    expect(users.users.length).toBe(3);
  });

  it('should find user',()=>{
    var userData = users.getUser('2');
    expect(userData).toEqual({
      id:'2',
      name:'Kashish',
      room:'room5'
    });
  });

  it('should not find user',()=>{
    var userInvalidData = users.getUser('91002');
    expect(userInvalidData).toNotExist();
  });

  it('should return names of the users in room1',()=>{
    var userList = users.getUserList('room1');
    expect(userList).toEqual(['Abhi','Ram']);
  });

  it('should return names of the users in room5',()=>{
    var userList = users.getUserList('room5');
    expect(userList).toEqual(['Kashish']);
  });



});
