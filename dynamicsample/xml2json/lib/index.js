var handle = require('hitd-handler');


var xml2js = require('xml2js');


var parser = new xml2js.Parser({
	trim: true,
	ignoreAttrs: true,
	explicitRoot: false,
	explicitArray: false
});

var rules = {};
rules['hitd-xml2json'] = function(key, req, cb) {
	parser.parseString(req.body, function(err, results) {
		cb(null, 200, results);
	})
};

module.exports = function(endpoint, conf, cb) {
	handle(endpoint, conf, rules, cb);
}
