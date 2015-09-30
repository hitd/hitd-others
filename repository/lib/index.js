var redis = require('redis'),
	handler = require('hitd-handler'),
	debug = require('hitd-debug')('hitd-repository');


module.exports = function(endpoint, conf, cb) {
	conf.repository = conf.repository || {};
	var HOST = conf.repository.host || '127.0.0.1:3000';

	var redis_port = conf.repository.redis_port || 6379;
	var redis_addr = conf.repository.redis_addr || '127.0.0.1';

	var rules = {};

	var client = redis.createClient(redis_port, redis_addr, {});

	var saveFileRules = function(key, req, cb) {

		debug('add ressource for key %s', key);

		if (!req || !req.body) {
			return cb(null, 204, req);
		}

		var redisKey = key.split('?').slice(1).join('');

		debug('Insert : length of resource %s is %d , type is %s ', key, req.body.length,
			typeof req.body);
		client.set(redisKey, req.body, function(err) {

			cb(err, 200, key);
		});
	};

	var getByKey = function(key, req, cb) {
		client.get('' + key, function(err, resource) {
			if (!err && resource) {
				//	resource = new Buffer(resource, 'binary').toString();
				debug('length of resource %s is %d', key, resource.length);
				return cb(null, 200, resource);
			} else {
				if (key[key.length - 1] === '/') {
					return cb(null, 302, 'index.html');
				}
				return cb(null, 404, '');
			}
		});
	};

	var saveSiteToServe = function(key, req, cb) {
		debug("save site to serve");
		debug('request to servicesite %s', req.body);
		var body = req.body;
		var rule = body + (body[body.length - 1] === '/' ? '*' : '/*');
		client.sadd('/hitd/sites', rule, function(err) {
			debug('rules for site added');
			//we also want to adversite directy to the router new rules
			var newRule = {};
			newRule[rule] = getByKey;
			handler(endpoint, conf, newRule, function() {
				debug('handler for site started');
				cb(null, 204, '');
			});
		});
	};

	rules['POST/http/' + HOST + '/saveFile?*'] = saveFileRules;
	rules['POST/http/' + HOST + '/serveSite'] = saveSiteToServe;

	client.smembers('/hitd/sites', function(err, members) {
		//for all sites , lets tell to the router we handle them
		members.forEach(function(rule) {
			rules[rule] = getByKey;
		});

		handler(endpoint, conf, rules, cb);

	});
};
