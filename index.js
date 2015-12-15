"use strict";

var http = require('http');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

function CSGameIntegration(port, host) {
	var self = this;
	this._cached = {};
	this._config = {
		'createServer': true
	};

	CSGameIntegration.prototype.parse = function(replacementData) {
		var eventList = {};
		recursiveReplace(self._cached, replacementData, null, function(key, newValue, oldValue, path) {
			eventList[(path.join('.') + '.' + key)] = [newValue, oldValue];
		});

		self.emit('<update>', self._cached)
		for(var event in eventList) self.emit(event, eventList[event][0], eventList[event][1], self._cached);
	}

	EventEmitter.call(this);

	if(typeof arguments[0] == 'object') {
		for(var prop in arguments[0]) this._config[prop] = arguments[0][prop];
		port = arguments[1];
		host = arguments[2];
	}

	if(this._config.createServer) {
		this._server = http.createServer(function(req, res) {
			req.on('data', function(data) {
				req.rawBody += data.toString();
			}).on('end', function() {
				try {
					req.body = JSON.parse(req.rawBody);
				} catch(err) {
					req.body = {};
				}

				this.parse(req.body);
				res.writeHead(200, {'Content-Type': 'text/plain'});
				res.end();
			});
		}).listen(port || 3000, host || '0.0.0.0');
	}

	return this;
}

function recursiveReplace(curr, repl, path, callbackFunction) {
	if(curr != repl) {
		for(var key in repl) {
			if(curr[key] != repl[key]) {
				if(!Array.isArray(path)) path = [];
				var newPath = path.slice();

				if(typeof repl[key] == 'object') {
					newPath.push(key);

					if(typeof curr[key] == 'object') {
						recursiveReplace(curr[key], repl[key], newPath, callbackFunction);
					} else if(typeof curr[key] != 'object') {
						curr[key] = {};
						recursiveReplace(curr[key], repl[key], newPath, callbackFunction);
					}
				} else {
					callbackFunction(key, repl[key], curr[key], newPath);
					curr[key] = repl[key];
				}
			} else curr[key] = repl[key];
		}
	}
}

util.inherits(CSGameIntegration, EventEmitter);

module.exports = function(port, host) {
	return (new CSGameIntegration(port, host));
};
