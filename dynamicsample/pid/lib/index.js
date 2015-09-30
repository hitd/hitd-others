var handle = require('hitd-handler');

var rules = {};

rules['hitd-pid'] = function(key, body, cb) {
	cb(null, 200, process.pid);
};

module.exports = function(endpoint, conf, cb) {
	handle(endpoint, conf, rules, cb);
};
