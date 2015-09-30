var handler = require('hitd-handler');

var MongoClient = require('mongodb').MongoClient,
	ObjectId = require('mongodb').ObjectId;


var debug = require('hitd-debug')('hitd-mongo');

module.exports = function(endpoint, conf, cb) {
	conf.repository = conf.repository || {};
	var HOST = conf.repository.host || '127.0.0.1:3000';

	conf.mongo = conf.mongo || {};
	var mongo_port = conf.mongo.mongo_port || 27017;
	var mongo_addr = conf.mongo.mongo_addr || '127.0.0.1';

	debug('starting');
	var rules = {};

	rules['mongo/*'] = function(key, req, cb) {
		debug('requested %s', key);
		var elements = key.split('/');
		var el = {
			basetype: elements[0],
			database: elements[1],
			collection: elements[2],
			operation: elements[3]
		};

		var mongourl = 'mongodb://' + mongo_addr + ':' + mongo_port + '/' + el.database;
		MongoClient.connect(mongourl, function(err, db) {

			var success = function(
				err,
				result) {
				debug('requested %s, result length is %d - %s ; err is %s ', key, (
					result || '').length, JSON.stringify(result), err);

				cb(err, err ? 500 : 200, result ? JSON.stringify(result) : '');

				db.close();
			};

			var reqBody = req.body;
			try {
				reqBody = JSON.parse(reqBody);
			} catch (err) {};



			if (el.operation === 'insert') {
				reqBody._id = reqBody._id || new ObjectId();
				db.collection(el.collection)[el.operation](reqBody, function(err) {
					success(err, reqBody);
				});
			} else if (el.operation === 'findOne') {

				db.collection(el.collection)[el.operation](reqBody, function(err,
					founded) {
					success(err, founded);
				});
			} else if (el.operation === 'findOneAndUpdate') {
				debug('find and modify operation is query %s , update ', JSON.stringify(
					reqBody.query), JSON.stringify(reqBody.update));

				db.collection(el.collection)[el.operation](
					reqBody.query, reqBody.update, {},
					function(err,
						founded) {
						success(err, founded);
					});
			} else if (el.operation === 'distinct') {

				debug('distinct operation is field %s , query %s , update ', JSON.stringify(
					reqBody.field), JSON.stringify(reqBody.query));

				db.collection(el.collection)[el.operation](
					reqBody.field, reqBody.query, {}, success);
			} else {
				db.collection(el.collection)[el.operation](reqBody).toArray(success);
			}

		});
	};
	handler(endpoint, conf, rules, cb);

};
