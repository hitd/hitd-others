var myModule = require('..');
var myPackage = require('../package.json');

var debug = require('hitd-debug')(myPackage.name);

debug('will start');

var registerEndPoint = 'tcp://127.0.0.1:12345';
if (process.env.ROUTER_ENV_INPORT_CLIENT_ADDR && process.env.ROUTER_ENV_INPORT_CLIENT_PROTO &&
  process.env.ROUTER_ENV_INPORT_CLIENT_PORT) {
  registerEndPoint = process.env.ROUTER_ENV_INPORT_CLIENT_PROTO + '://' +
    process.env.ROUTER_ENV_INPORT_CLIENT_ADDR + ':' + process.env.ROUTER_ENV_INPORT_CLIENT_PORT;
}

var redis_port = +(process.env.REDIS_PORT_6379_TCP_PORT) || 6379;
var redis_addr = process.env.REDIS_PORT_6379_TCP_ADDR || '127.0.0.1';

myModule(registerEndPoint, {
  heartbeat: 30,
  repository: {
    host: process.env.HOST || '127.0.0.1:3000';
    redis_port: redis_port,
    redis_addr: redis_addr
  }
}, function() {
  debug('did start');
});
