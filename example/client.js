'use strict';

let nano = require('nanomsg');
let sub = nano.socket('sub', {chan:['']});

sub.on('data', function(buffer) {

  try {
    let msg = String(buffer).split('|*|')[1];
    console.log(JSON.parse(msg));    
  } catch(error) {
    console.log(error);
  }
});

sub.connect('tcp://127.0.0.1:5678');
