'use strict';

const http = require('http');
const differ = require('object-differ');
const EventEmitter = require('events').EventEmitter;

class CSGameIntegration extends EventEmitter {
  constructor(port, host) {
    // Call the super constructor => Inherit functions from EventEmitter 
    super();

    const args = Array.prototype.slice.call(arguments, 0);

    // Previous update (reference to check for changes)
    this._previous = {};

    // Default configuration
    this._config = { 'createServer': true };
    let conf;

    // The first argument is an object? => apply properties to ._config ...
    if(typeof ( conf = args.shift() ) === 'object') {
      for(const prop in conf) this._config[prop] = conf[prop];

      // ... and shift other parameters 
      port = args.shift();
      host = args.shift();
    }

    if(this._config.createServer) {
      // Create an HTTP server ...
      this._server = http.createServer((req, res) => {

        req
          .on('data', data => req.rawBody = (req.rawBody || '') + data.toString() )
          .on('end', () => {
            try {
              // Parse the body to a JS Object
              req.body = JSON.parse(req.rawBody);

              // Pass the body to .parse() and check for changes
              this.parse(req.body);

              // Respond with HTTP: "200 OK"
              res.writeHead(200, { 'Content-Type': 'text/plain' });
              res.end();

            } catch(err) {
              // Request body contains malformed JSON? => Respond with HTTP "400 Bad Request"
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(err));
            }
          });

        // ... and start listening
      }).listen(port || 3000, host || '0.0.0.0');
    }
  }

  parse(data) {
    const events = {};

    // Update ._previous while checking for changes ...
    differ(this._previous, data, (key, val, old, path) => {
      events[path.join('.') + '.' + key] = [val, old];
    }, true, true);

    for(const event in events) 
      // ... which will then be propagated
      this.emit(event, events[event][0], events[event][1], this._previous);

    this.emit('<update>', this._previous);
  }
}

module.exports = CSGameIntegration;