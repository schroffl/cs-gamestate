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

		recursiveReplace(self._cached, req.body, null, function(key, value, path) {
			eventList[(path.join('.') + '.' + key)] = value;
		});

		for(var event in eventList) self.emit(event, eventList[event], self._cached);
		res.status(200).end();
	});

	this._server.listen(port || 1337, host || '0.0.0.0');
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
					curr[key] = repl[key];
					callbackFunction(key, curr[key], newPath);
				}
			} else curr[key] = repl[key];
		}
	}
}

util.inherits(CSGameIntegration, EventEmitter);
module.exports = CSGameIntegration;
