var handle = require('hitd-handler');

var rules = {};

rules['hitd-random'] = function(key, body, cb) {
	cb(null, 200, Math.random());
};

module.exports = function(endpoint, conf, cb) {
	handle(endpoint, conf, rules, cb);
};
