
// Cluster: Worker: Commands

var cmds = exports.commands = require('../commands').createCommands();

cmds.add('start', function(msg) {
    var options = msg.options;
    
    require(options.app).main(options, function(){
        process.send({event: 'ready'});
    });
});

cmds.add('stop', function(msg) {
    process.exit(0);
});
