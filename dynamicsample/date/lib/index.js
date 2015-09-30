var handle = require('hitd-handler');

var rules = {};

rules['hitd-date'] = function(key, body, cb) {
	cb(null, 200, new Date().toString());
};

module.exports = function(endpoint, conf, cb) {
	handle(endpoint, conf, rules, cb);
};
