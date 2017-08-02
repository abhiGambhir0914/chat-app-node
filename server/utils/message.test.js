var expect = require('expect');

var {generateMessage,generateLocationMessage}= require('./message.js');

describe('generateMessage',()=>{
  it('should generate correct message object',()=>{
    var from='Jen';
    var text='some msg';
    var message=generateMessage(from,text);

    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({
      from:from,
      text:text,
    });
  });
});

describe('generateLocationMessage',()=>{
  it('should generate correct location object',()=>{
    var from='Jenna';
    var url='https://www.google.com/maps?q=';
    var message=generateLocationMessage(from,1,1);

    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({
      from:from,
      url:url+'1,1'
    });
  });
});
