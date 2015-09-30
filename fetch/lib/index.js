var handle = require('hitd-handler');
var request = require('request');
var debug = require('hitd-debug')('hitd-http');

var cookies = {};

module.exports = function(endpoint, conf, cb) {


	var rules = {};

	var confs = conf['rules'];

	if (!confs) {
		return cb('you should provide conf.rules');
	}
	rules = confs.reduce(function(memo, item) {

		var from = item.from;
		var to = item.to;

		memo[from] = function(key, req, cb) {

			var sliceLength = from[from.length - 1] !== '*' ? from.length : from.length -
				1;
			var url = to + key.slice(sliceLength);

			var jar = undefined;
			if (req.clientId) {
				jar = cookies[req.clientId] = cookies[req.clientId] || (request.jar());
			}
			request({
				url: url,
				followRedirect: false,
				strictSSL: false,
				jar: jar || false
			}, function(err, res, body) {
				if (err) {
					debug('we got an error while fetching %s : %s', url, err);
					return cb(err, 500);
				}

				var root = item.root || from.replace(/^http\//, 'http://').replace(
					/^https\//, 'https: //').replace('*', '');

				/*		if (res.headers && res.headers['set-cookie']) {
							debug('we set cookie %s %s', res.headers['set-cookie'], url);

							var cookie = res.headers['set-cookie'];
							if (cookie.indexOf(to) != -1) {
								cookie = cookie.replace(to, root);
							}
							cb(err, 1, res.headers['set-cookie']);
						} else {
							debug('no cookie for %s %s', res.headers, url);
						}*/

				if (res.headers && res.headers['content-type']) {
					cb(err, 2, res.headers['content-type']);
				}

				if (res.statusCode != 302) {
					cb(err, res.statusCode, body);
				} else {
					if (res.headers.location && res.headers.location[0] === '/') {
						cb(err, res.statusCode, root + res.headers.location);
					} else {
						cb(err, res.statusCode, res.headers.location);
					}
				}

			});
		};

		debug('add new rule, redirecting ', from, 'to', to);
		return memo;

	}, {});

	handle(endpoint, conf, rules, cb);
};
