var http = require('http');
var util = require('util');
var express = require('express');
var EventEmitter = require('events').EventEmitter;

function CSGameIntegration(port, host) {
	var self = this;
	this._router = express();
	this._server = http.createServer(this._router);
	this._cached = {};

	EventEmitter.call(this);

	this._router.use(function(req, res, next) {
		req.rawBody = '';

		req.on('data', function(data) {
			req.rawBody += data.toString();
		}).on('end', function() {
			req.body = JSON.parse(req.rawBody);
			delete req.rawBody;
			next();
		});
	});

	this._router.post('/', function(req, res) {
		var eventList = {};

		recursiveReplace(self._cached, req.body, null, function(key, newValue, oldValue, path) {
			eventList[(path.join('.') + '.' + key)] = [newValue, oldValue];
		});

		self.emit('<update>', self._cached)
		for(var event in eventList) self.emit(event, eventList[event][0], eventList[event][1], self._cached);
		res.status(200).end();
	});

	this._server.listen(port || 3000, host || '0.0.0.0');
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
					callbackFunction(key, repl[key], curr[key],newPath);
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
