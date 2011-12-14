
// Cluster: Master

var cluster = null;
var workers = {};
var workersNum = 0;

var commands = require('./commands').commands;

// Initialize the master.
var init = exports.init = function(_cluster, options) {

    cluster = _cluster;
    commands.set('_options', options);
    
    cluster.on('death', function(worker) {
        //console.log(arguments);
        delete workers[worker.pid];
        workersNum -= 1;
        
        if(worker.exitCode>0) {
            console.log('Worker ' + worker.pid + ' died with error: code '+worker.exitCode);
        } else {
            console.log('Worker ' + worker.pid + ' died');
        }
        
        if(worker.restart) {
            fork();
        }
        
        //fork();
        if(workersNum===0) {
            process.exit(0);
        }
    });
    
    process.on('exit', function(){
        console.log('Bye!');
    });
    
    //setInterval(function(){restartAll();}, 10000);
    //setInterval(function(){restartAllZDT();}, 10000);
    
    return exports;
};

// Return an array containing pids of online workers.
var getPids = exports.getPids = function() {
    return Object.keys(workers);
};

// Fork a new worker.
var fork = exports.fork = function(cb) {
    var worker = cluster.fork();
    worker.on('message', function(){
        commands.handleMessage.apply(commands, [this].concat(Array.prototype.slice.call(arguments)));
    });
    worker.cb = cb || function(){};
    workers[worker.pid] = worker;
    workersNum += 1;
    return worker;
};

// Stop a worker.
var stop = exports.stop = function(pid) {
    workers[pid].send({cmd:'stop'});
};

// Restart a worker.
var restart = exports.restart = function(pid) {
    if(!workers[pid].restart) {
        console.log('Restarting '+pid+'...');
        workers[pid].restart = true;
        stop(pid);
    }
};

// Restart all workers.
var restartAll = exports.restartAll = function() {
    getPids().forEach(function(pid) {
        restart(pid);
    });
};

// Restart a worker (zero-down-time).
var restartZDT = exports.restartZDT = function(pid) {
    if(!workers[pid].restartZDT) {
        console.log('ZDTRestarting '+pid+'...');
        workers[pid].restartZDT = true;
        fork(function(){
            stop(pid);
        });
    }
};

// Restart all workers (zero-down-time).
var restartAllZDT = exports.restartAllZDT = function() {
    getPids().forEach(function(pid) {
        restartZDT(pid);
    });
};
