
var cluster = require('cluster');

exports.run = function(options) {
    
    if(cluster.isMaster) {
        
        // defaults
        if(!options.port) {
            options.port = 8080;
        }
        if(!options.hostname) {
            options.port = '0.0.0.0';
        }
        if(!options.user) {
            options.port = 'node';
        }
        if(!options.app_path) {
            options.app_path = require.resolve('../app');
        } else {
            options.app_path = require.resolve(options.app_path);    
        }
        
        var numCPUs = require('os').cpus().length;
        var master = require('./master').init(cluster, options);
        
        // spawn cluster workers, one per cpu
        for(var i = 0; i < numCPUs; i++) {
            master.fork();
        }
        
    } else {
        
        require('./worker').start();
        
    }
    
}
