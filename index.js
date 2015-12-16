"use strict";

var http = require('http');
var util = require('util');
var differ = require('object-differ');
var EventEmitter = require('events').EventEmitter;

function CSGameIntegration(port, host) {
	var self = this;
	this._cached = {};
	this._config = {
		'createServer': true
	};

	CSGameIntegration.prototype.parse = function(replacementData) {
		var eventList = {};
		differ(self._cached, replacementData, function(key, newValue, oldValue, path) {
			eventList[(path.join('.') + '.' + key)] = [newValue, oldValue];
		}, true, true);

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
				req.rawBody = (req.rawBody || '') + data.toString();
			}).on('end', function() {
				try {
					req.body = JSON.parse(req.rawBody);
				} catch(err) {
					req.body = {};
				}

				self.parse(req.body);
				res.writeHead(200, {'Content-Type': 'text/plain'});
				res.end();
			});
		}).listen(port || 3000, host || '0.0.0.0');
	}

	return this;
}

util.inherits(CSGameIntegration, EventEmitter);

module.exports = function() {
	var temp = function() {};
	var inst, ret;

	temp.prototype = CSGameIntegration.prototype;
	inst = new temp;

	ret = CSGameIntegration.apply(inst, arguments);

	return ret;
};
