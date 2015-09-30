#!/usr/bin/env node

var request = require('request');
var async = require('async');

var debug = require('hitd-debug')('hitd-deploystatic');
var yauzl = require('yauzl');

module.exports = function(endpoint, conf, cb) {
  var opts = conf;
  debug('will open file %s', opts.archive);
  yauzl.open(opts.archive, {
    autoClose: false
  }, function(err, zipfile) {

    if (err) {
      return cb(err);
    }
    var entries = [];

    zipfile.on('entry', function(entry) {
      entries.push(entry);
    }).on('end', function() {


      debug('%d entries to publish', entries.length);

      async.eachLimit(entries, 10, function(entry, cb) {
        debug('will publish file %s', entry.fileName);
        var key = 'http/' + opts.root;
        if (opts.folder) {
          key += '/' + opts.folder
        }
        key += '/' + entry.fileName;
        zipfile.openReadStream(entry, function(err, fileStream) {
          //console.log("starting with file", key);
          if (err) {
            console.log("error reading file", err);
            return cb(err);
          }

          //  debug('file stream for key %s has length %d', key,
          //    fileStream.length);
          var fullurl = 'http://' + opts.root + '/saveFile?' +
            key;
          var postRequest = request.post(fullurl);

          postRequest.on('error', function(err) {
            console.log("error ", err);
          });

          postRequest.on("complete", function(res) {
            cb();
          });

          fileStream.pipe(postRequest);

        });

      }, function() {

        // we also need to tell redis to add site
        var siteToServe = 'http/' + opts.root + '/' + opts.folder +
          '/';
        request.post({
          url: 'http://' + opts.root + '/serveSite',
          body: siteToServe
        }, function(err, response, body) {
          cb(null);

        });

      });
    });
  });
};
