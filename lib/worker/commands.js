
// Cluster: Worker: Commands

var cmds = exports.commands = require('../commands').createCommands();

cmds.add('start', function(msg) {
    
    //console.log('Worker '+this.pid+': start', msg);
    var options = msg.options;
    
    require(options.app_path).main(function(){
        process.send({event: 'ready'});
    });
});

cmds.add('stop', function(msg) {
    process.exit(0);
});
