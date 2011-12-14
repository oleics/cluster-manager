
// Cluster: Worker

var commands = require('./commands').commands;

var log = function() {
    console.log.apply(this, ['Worker '+process.pid+':'].concat(Array.prototype.slice.call(arguments)));
};

exports.start = function() {
    
    process.on('message', function(msg){
        commands.handleMessage.apply(commands, [this].concat(Array.prototype.slice.call(arguments)));
    });
    
    process.on('exit', function(){
        console.log('Worker '+process.pid+' says "Good Bye!"');
    });
    
}
