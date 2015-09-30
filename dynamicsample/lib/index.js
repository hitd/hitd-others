var handle = require('hitd-handler');
var Client = require('hitd-client');
var debug = require('hitd-debug')('hitd-dyna');
var rules = {};

var myrequire = function(key) {
	try {
		debug('will try to load service', key);
		var service = require(key)
	} catch (e) {
		debug('service loading failure', key);
		if (key.split('-').length > 2) {
			return myrequire(key.split('-').slice(0, -1).join('-'));
		}
		debug('service loading failure : return null');
		return null;
	}
	debug('service loaded with success', key);
	return service;
}
module.exports = function(endpoint, conf, cb) {

	rules['hitd-*'] = function(key, body, cb) {

		// we should start the good service

		var service = myrequire(key);

		if (!service) {
			return cb(null, 500, 'service ' + key + ' cannot be loaded');
		};

		service(endpoint, conf, function() {
			//service started, let ask for it;
			//lets start a client
			Client(endpoint, conf, function(err, client) {
				client.request(key, body, cb);
			});
		});
	};

	handle(endpoint, conf, rules, cb);
};
