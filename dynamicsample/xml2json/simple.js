var reqrep = require('hitd-reqrep'),
	port = 'ipc:///tmp/routein';


reqrep(port, function(err, getResource) {
	var XML = '<foo name="firstlevel" e="ll" ><toto>aa</toto></foo>';
	getResource('xmltojson ' + XML, function(err, code) {
		console.log('XML ', XML);
		console.log('JSON ', code.toString());
	});
});
