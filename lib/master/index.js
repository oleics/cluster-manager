
// Cluster: Master

var util = require('util');
var EventEmitter = require('events').EventEmitter;

//
var _logEvents = function(name, obj) {
    var emit = obj.emit;
    obj.emit = function() {
        console.log(name, arguments);
        emit.apply(this, Array.prototype.slice.call(arguments));
    };
};

exports.createMaster = function(cluster, options) {
    return new Master(cluster, options);
};

// Constructor.
var Master = exports.Master = function(cluster, options) {
    if(!(this instanceof Master)) return new Master(cluster, options);
    //_logEvents('master', this);
    
    Object.defineProperty(this, 'pid', {
        value: process.pid,
        writable: false
    });
    
    this.commands = require('./commands').commands;
    
    this.cluster = cluster;
    _logEvents('cluster', this.cluster);

    this.options = options;
    this.commands.set('_options', options);
    
    this.workers = {};
    
    var self = this;
    
    this.cluster.on('death', function(worker) {
        delete self.workers[worker.pid];
        
        if(worker.exitCode>0) {
            console.log('Worker ' + worker.pid + ' died with error: code '+worker.exitCode);
        } else {
            console.log('Worker ' + worker.pid + ' died');
        }
        
        if(worker.restart) {
            self.fork();
        }
        
        //fork();
        if(self.workersNum()===0) {
            process.exit(0);
        }
    });
    
    this.on('message', function(msg, worker, master) {
        this.commands.handleMessage.call(this.commands, worker, msg);
    });
};
util.inherits(Master, EventEmitter);

// Return an array containing pids of online workers.
Master.prototype.getPIDs = function() {
    return Object.keys(this.workers);
};

// Return number of online workers.
Master.prototype.workersNum = function() {
    return Object.keys(this.workers).length;
};

// Fork a new worker.
Master.prototype.fork = function(cb) {
    var worker = this.cluster.fork();
    _logEvents('worker', worker);
    worker.on('message', (function(master){
        return function(msg) {
            master.emit('message', msg, this, process);
        }
    })(this));
    //worker.on('exit', function(exitCode){
    //});
    worker.cb = cb || function(){};
    this.workers[worker.pid] = worker;
    this.emit('fork', worker, process);
    return worker;
};

// Stop a worker.
Master.prototype.stop = function(pid, cb) {
    workers[pid].send({cmd:'stop'});
};

// Restart a worker.
Master.prototype.restart = function(pid, cb) {
    if(!this.workers[pid].restart) {
        console.log('Restarting '+pid+'...');
        this.workers[pid].restart = true;
        this.stop(pid);
    }
};

// Restart all workers.
Master.prototype.restartAll = function() {
    var self = this;
    this.getPids().forEach(function(pid) {
        self.restart(pid);
    });
};


// Restart a worker (zero-down-time).
Master.prototype.restartZDT = function(pid) {
    if(!this.workers[pid].restartZDT) {
        console.log('ZDTRestarting '+pid+'...');
        this.workers[pid].restartZDT = true;
        var self = this;
        this.fork(function(){
            self.stop(pid);
        });
    }
};

// Restart all workers (zero-down-time).
Master.prototype.restartAllZDT = function() {
    var self = this;
    this.getPids().forEach(function(pid) {
        self.restartZDT(pid);
    });
};
