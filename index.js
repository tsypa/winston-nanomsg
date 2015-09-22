'use strict';

let util = require('util');
let winston = require('winston');
let nano = require('nanomsg');

let Nanomsg = winston.transports.Nanomsg =  function(options) {
  let options = options || {};

  if ((!options.transport || options.transport === 'tcp') && !options.port) {
    throw new Error('Cannot log to nanomsg without tcp port number');
  }  
  // check transport type
  if (!(options.transport === 'inproc'
	|| options.transport === 'ipc'
	|| options.transport === 'tcp'
	// tcpmux and ws is experimental features, we are waiting for notice
	// || options.transport === 'tcpmux'
	// || options.transport === 'ws'
       )) {
    throw new Error('Invalid transport option: ' + options.transport);
  }

  if (options.address && typeof options.address !== 'string') {
    throw new Error('The Address option must be a srting e.g. "tcp://127.0.0.1" or "inproc://test"');
  }

  this.name = 'nanomsg';
  this.port = options.port;
  this.level = options.level || 'info';
  this.transport = options.transport || 'tcp';
  this.address = options.address || '*';
  this.separator = options.separator || '|*|';
  this.prefixMapping = options.prefixMapping || {silly: 1, verbose: 2, info: 3, warn: 4, debug: 5, error: 6};
  
  let addr = this.transport + '://' + this.address;
  
  if (this.transports === 'tcp') {
    addr += ':' + this.port;
  }
  
  this.pub = nano.socket('pub');
  this.pub.bind(addr);
};

util.inherits(Nanomsg, winston.Transport);

Nanomsg.prototype.log = function(level, msg, meta, callback) {
  let error = null;
  let message;

  try {
    this.pub.send(self.constructMessage(level, msg, meta));
  } catch(e) {
    error = e;
  }
  
  return callback(error);
};

Nanomsg.prototype.constructMessage() = function(level, msg, meta) {
  let self = this;
  let entry;
  let prefix;
  let prefixLen;

  if (!self.prefix) {
    throw new Error('No Prefix set');
  }

  if (self.prefixMapping[level]) {
    let prefixLen = parseInt(self.prefixMapping[level]);
    if (prefixLen < 1) {
      throw new Error('The mapped prefix level for ' + level + ' is less than 1.');
    }
    // Generate a repeated string.
    prefix = Array(prefixLen + 1).join(self.prefix);
  } else {
    throw new Error('There is no mapping present for log level "' + level + '". You should pass a prefixMapping object in the options: e.g. {"' + level + '": 2}');
  }
  
  // Get our message together
  if (typeof self.formatter === 'function') {
        entry = self.formatter(level, msg, meta);
    } else {
        entry = {
            timestamp: new Date(), // RFC3339/ISO8601 format instead of common.timestamp()
            level: level,
            message: msg,
            meta: meta
        };
        entry = JSON.stringify(entry);
    }
  
    // Prefix the message with the requisite number of the prefix
    return prefix + this.separator + entry;

};

module.exports = Nanomsg;
