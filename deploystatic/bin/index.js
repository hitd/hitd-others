var program = require('commander');

program.option('-r, --root [root]', 'specify the root', '127.0.0.1:3000')
  .option('-f, --folder [folder]', 'specify the folder', '.')
  .option('-a, --archive [archive]', 'specify the archive', 'site.zip');

var deploy = require('..')(program, function(err, status) {
  console.log('deploy', err, status);
});
