'use strict';

let nano = require('nanomsg');
let pub = nano.socket('pub');
//let sub = nano.socket('sub');

let addr = 'tcp://127.0.0.1:5678';

pub.bind(addr);
//sub.connect(addr);

//sub.on('data', function(buffer){
//  console.log(String(buffer));
//});


let seq = 0;

setInterval(function() {
  pub.send('* HI' + seq.toString());
  ++seq;
}, 1000);








