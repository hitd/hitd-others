var handle = require('hitd-handler');


var nodemailer = require('nodemailer');

module.exports = function(endpoint, conf, cb) {
	var rules = {};

	conf.mail = conf.mail || {};

	var host = conf.mail.host || '127.0.0.1';
	var port = conf.mail.port || 25;

	var transporter = nodemailer.createTransport({
		host: host,
		port: port,
		service: 'smtp'
	});

	rules['mail'] = function(key, body, cb) {
		transporter.sendMail(body, function(err, info) {
			cb(err, err ? 500 : 200, info);
		});
	};


	handle(endpoint, conf, rules, cb);
};
