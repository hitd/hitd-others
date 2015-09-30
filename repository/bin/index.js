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

var mongo_port = +(process.env.MONGO_PORT_6379_TCP_PORT) || 27017;
var mongo_addr = process.env.MONGO_PORT_6379_TCP_ADDR || '127.0.0.1';

myModule(registerEndPoint, {
  heartbeat: 30,
  repository: {
    host: process.env.HOST || '127.0.0.1:3000';
    mongo_port: mongo_port,
    mongo_addr: mongo_addr
  }
}, function() {
  debug('did start');
});
