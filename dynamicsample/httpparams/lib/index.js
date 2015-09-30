var handle = require('hitd-handler');

var rules = {};

rules['hitd-httpparams'] = function(key, body, cb) {
	var key = body.body;

	var path = key.split('?')[0];
	var queryparams = key.split('?')[1];
	var params = (queryparams || '').split('&').reduce(function(memo, val) {
		var keyval = val.split('=');
		memo[keyval[0]] = keyval[1];
		return memo;
	}, {});


	var keys = path.split('/');
	var last = keys[keys.length - 1];

	var method = (keys[0] === 'http') ? 'GET' : keys[0];
	if (keys[0] === 'http') {
		path = 'GET/' + path;
	}
	path = path.split('/').slice(1).join('/');

	cb(null, 200, {
		method: method,
		path: path,
		splitted: path.split('/'),
		params: params,
		last: last
	});
};

module.exports = function(endpoint, conf, cb) {
	handle(endpoint, conf, rules, cb);
};
