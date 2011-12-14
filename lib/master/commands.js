
// Cluster: Master: Commands

var cmds = exports.commands = require('../commands').createCommands();

cmds.add('_options', {});

cmds.add('online', function(msg) {
    console.log('Worker '+this.pid+': online');
    this.send({cmd: 'start', options: cmds.get('_options')});
});

cmds.add('queryServer', function(msg) {
    console.log('Worker '+this.pid+': listening to '+msg.address+':'+msg.port+'');
});

cmds.on('ready', function(worker) {
    console.log('Worker '+worker.pid+': ready');
    worker.cb();
});
