var debug = require('hitd-debug')('hitd-httphandler');

var Client = require('hitd-client');
var zhandler = require('hitd-handler');

module.exports = function httpHandler(line) {

  var rules = {};
  var handlers = {};
  var client;

  var router = function(key, body, cb) {
    debug('handling a request %s', key);
    client.request('hitd-httpparams', key, function(err, code,
      params) {
      debug('handling a %s request path is %s, params is %s',
        params.method,
        params.path,
        JSON.stringify(params.params));

      if (params.path.indexOf(line) != 0) {
        return debug('Internal probelm with routing');
        return cb(null, '500, Internal probelm with routing');
      }

      handlers[params.method] = handlers[params.method] || {};
      var obj = params.path.slice(line.length + 1).split('/').reduce(
        function(
          memo, item) {
          if (!memo) {
            return undefined;
          };
          if (memo[item]) {
            return memo[item]
          };
          if (memo['*'] && memo['*'].value) {
            params.params = params.params || {};
            params.params[memo['*'].key] = item;
            return memo['*'].value;
          }
          return undefined;
        }, handlers[params.method]);

      if (obj && obj.handler) {
        obj.handler(params, body.body, cb)
      } else {
        debug('NOT IMPLEMENTED');
        cb(null, 501, 'NOT IMPLEMENTED');
      }

    });
  };

  rules[line + '/*'] = router;
  rules['POST/' + line + '/*'] = router;
  rules['PUT/' + line + '/*'] = router;
  rules['DELETE/' + line + '/*'] = router;

  return {
    start: function(endpoint, conf, cb) {
      Client(endpoint, conf, function(err, _client) {
        client = _client;
        zhandler(endpoint, conf, rules, cb);
      });
    },
    add: function(method, path, handler) {

      if (path[0] === '/') {
        path = path.slice(1);
      }

      handlers[method] = handlers[method] || {};
      var obj = path.split('/').reduce(function(memo, item) {
          var key = item[0] === ':' ? '*' : item;
          var toReturn;
          if (key === '*') {
            memo[key] = memo[key] || {
              key: item.slice(1),
              value: {}
            };
            toReturn = memo[key].value;
          } else {
            toReturn = memo[key] = memo[key] || {};
          }
          return toReturn;
        },
        handlers[method]);

      obj.handler = handler;
    }
  };
};
