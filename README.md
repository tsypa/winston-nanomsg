# winston-nanomsg

A nanomsg transport for [winston][0].

## Installation

### Installing winston-nanomsg

``` bash
  $ npm install winston-nanomsg
```

## Purpose

This winston transport allows you to publish logs using a nanomsg pub socket (so that multiple recipients can subscribe to it)

The message is sent with a variable length prefix that allows the subscribers to subscribe log message of a certain threshold and above.

## Usage
``` js
  var winston = require('winston');  
  require('winston-nanomsg');  
  winston.add(winston.transports.Nanomsg, options);
```

The Nanomsg transport takes the following options.

* __transport:__ Transport to use for Nanomsg. (inproc|ipc|tcp)
* __address:__ Address that the socket will bind to e.g. "127.0.0.1" or "*" or "eth0" 
* __separator:__ Separator to separate the level string from the JSON default |*|
* __prefix:__ Prefix used to denote the log level
* __prefixMapping:__ Mapping between log levels and prefix string length. Used if using custom log levels. e.g. { silly: 1, verbose: 2, info: 3, warn: 4, debug: 5, error: 6 }
* __port:__ [required for tcp] : port to bind to when using the tcp transport  
* __level:__ Level of messages that this transport should log.
* __formatter:__ Optional formatter function to override the structure of the JSON data sent to the subscriber

*Metadata:* Logged as a native JSON object.

## Examples

###Client 
```
'use strict';

let nano = require('nanomsg');
// subscribe to all log levels
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
```

### Log Source

```
'use strict';

var winston = require('winston');
require('winston-nanomsg');

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

```

### Message Format

The above two messages will be transmitted as:

```
***|*|{"timestamp":"2015-09-22T14:25:37.936Z","level":"info","message":"foo:0","meta":{}}
*****|*|{"timestamp":"2015-09-22T14:25:37.943Z","level":"debug","message":"bar:0","meta":{}}
```

#### Author: [Maxim Tsyplakov](http://twitter.com/yoshenori)

[0]: https://github.com/indexzero/winston
