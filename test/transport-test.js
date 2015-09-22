'use strict';

var expect = require('chai').expect;
var rewire = require('rewire');
var transport;
var winston;

describe('Nanomsg', function() {
  before(function(){
    winston = require('winston');
    expect(winston.transports).to.not.have.ownProperty('Nanomsg');
    transport = require('../index');
    expect(winston.transports).to.have.ownProperty('Nanomsg');
    removeConsole();    
  });
  
  function removeConsole () {
    if (winston.transports.Console) {
      winston.remove(winston.transports.Console);
    }
  }
});
