var handle = require('hitd-handler'),
	debug = require('hitd-debug')('hitd-proxy');
var Client = require('hitd-client');

module.exports = function(endpoint, conf, cb) {
	conf.proxy = conf.proxy || {};
	var client;
	var rules = {};

	rules[conf.proxy.service.in || conf.proxy.service] = function(key, body, cb) {

		var inService = conf.proxy.service.in || conf.proxy.service;
		var outService = conf.proxy.service.out || conf.proxy.service;

		var cleanInService = inService;
		var cleanOutservice = outService;

		if (inService[inService.length - 1] === '*') {
			cleanInService = inService.slice(0, -1);
			outService = outService + key.slice(inService.length - 1);
		}

		client.request(outService, body, function(err, code, data) {
			if (code !== 302) {
				return cb(err, code, data);
			};

			if (data.indexOf('http') !== 0) {
				cb(err, code, data);
			}

			var path = data.replace('http://', 'http/').replace('https://', 'https/');

			if (path.indexOf(cleanOutservice) === 0) {
				//we should change path
				path = cleanInService + path.slice(cleanOutservice.length);
			}

			path = path.replace('http/', 'http://').replace('https/', 'https://');
			cb(err, code, path);
		});

	};

	Client(conf.proxy.remote || endpoint, conf, function(err, _client) {
		client = _client;
		handle(endpoint, conf, rules, cb);
	});

};
