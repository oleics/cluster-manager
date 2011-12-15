
var cluster = require('cluster');

exports.run = function(options) {
    
    if(cluster.isMaster) {
        
        if(!options.app) {
            options.app = require.resolve('../app');
        } else {
            options.app = require.resolve('../'+options.app);    
        }
        
        var num = options.num || require('os').cpus().length;
        var master = require('./master').createMaster(cluster, options);
        
        master.on('fork', function(worker, master){
            console.log('[%d] worker %d forked', master.pid, worker.pid);
        });
        master.on('message', function(msg, worker, master){
            console.log('[%d] message from worker %d', master.pid, worker.pid, msg);
        });
        
        // spawn cluster workers, one per cpu
        for(var i = 0; i < num; i++) {
            master.fork();
        }
        
        return master;
        
    } else {
        
        require('./worker').start();
        
    }
    
}
