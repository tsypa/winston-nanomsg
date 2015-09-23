'use strict';

var winston = require('winston');
require('../index.js');

let logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Nanomsg)({
      address:'127.0.0.1',
      port: 5678,
      level: 'silly'
    })
  ]
});

let seq = 0;

setInterval(function() {
  logger.log('info', 'foo:' + seq);
  logger.log('debug', 'bar:' + seq);
  ++seq;
}, 1000);
