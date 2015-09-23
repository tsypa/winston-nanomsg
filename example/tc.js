'use strict';

let nano = require('nanomsg');
let sub = nano.socket('sub', {chan:['*']});
let addr = 'tcp://127.0.0.1:5678';

sub.connect(addr, {chan:['info']});

sub.on('data', function(buffer){
  console.log(String(buffer));
});
