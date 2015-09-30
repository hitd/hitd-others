var handle = require('../../dynamic/handle');

var MongoClient = require('mongodb').MongoClient,
	assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
        var col = db.collection('transactions');
	assert.equal(null, err);
	console.log("Connected correctly to server");

	var rules = {};
        rules["POST/http/127.0.0.1:3000/mysite/*"] = function(key, cb) {
        var body = key.split(' ')[1];
        var pairs = body.split('&');
        var content = pairs.reduce( function( memo, pair){
          var KV = pair.split('=');
          memo[KV[0]] = KV[1];
          return memo;
          } , {});
        var user = content["user"];
        col.insert( content, function(err, data){
          cb(null, 302, "transactionlist.html#user="+user);
          });
        };

        rules["http/127.0.0.1:3000/mysite/transactions/*"] = function(key, cb) {
        var keys = key.split('/');
        var user = keys[ keys.length -1 ]; 
        console.log("user is", user);

          col.find({ user : user }, function(err, data){
              data.toArray( function(err, data){
                cb( null, 200, JSON.stringify( data) );
                });
              });
        };

        handle('tcp://127.0.0.1:12346', rules);

        //	db.close();
});
