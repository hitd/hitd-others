var Dyna = require('hitd-*');
var Client = require('hitd-client');
var Router = require('hitd-router');


var debug = require('hitd-debug')('hitd-local');

var _endpoint;

module.exports = {
	start: function(endpoint, conf, cb) {
		if (_endpoint) {
			return cb('already initialized');
		};
		_endpoint = endpoint;
		if(conf.noRouter) {
			debug('will start dyna');
			var dyna = new Dyna(endpoint, conf, function() {
					debug('dyna start');
					cb();
					});

		} else{
			debug('will start router');
			var router = new Router(endpoint, conf, function() {
					debug('router started');
					debug('will start dyna');
					var dyna = new Dyna(endpoint, conf, function() {
						debug('dyna start');
						cb();
						});
					})
		}
	       },
client: function(conf, cb) {
		if (!_endpoint) {
			return cb('_endpoint not initialized');
		}
		debug('will Create client');
		Client(_endpoint, conf, function(err, client) {
				debug('will client created');
				cb(err, client);
				});
	}
};
