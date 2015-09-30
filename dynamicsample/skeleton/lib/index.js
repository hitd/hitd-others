var handle = require('hitd-handler'),
	debug = require('hitd-debug')('hitd-skeleton');

var rules = {};

rules['hitd-skeleton/*'] = function(key, body, cb) {
	debug('request with key %s and body %s', key, JSON.Stringify(body));
	cb(null, 200, 'foo');
};

module.exports = function(endpoint, conf, cb) {
	handle(endpoint, conf, rules, cb);
};
