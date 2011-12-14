
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Commands = exports.Commands = function() {
    if(!(this instanceof Commands)) return new Commands();
    
    this.cmds = {};
};
util.inherits(Commands, EventEmitter);

Commands.prototype.list = function() {
    return Object.keys(this.cmds);
};

Commands.prototype.exists = function(name) {
    return (name in this.cmds);
};

Commands.prototype.set = function(name, value) {
    this.cmds[name] = value;
};

Commands.prototype.add = function(name, value) {
    if(name in this.cmds) {
        throw new Error('Command `'+name+'` allready exists.');
    }
    this.cmds[name] = value;
};

Commands.prototype.get = function(name) {
    return this.cmds[name];
};

Commands.prototype.exec = function(name, args, space) {
    return this.cmds[name].apply(space||this, args);
};

Commands.prototype.remove = function(name) {
    if(name in this.cmds) {
        delete this.cmds[name];
        return true;
    } else {
        return false;
    }
};

Commands.prototype.handleMessage = function(scope, msg) {
    if(this.exists(msg.cmd)) {
        this.exec(msg.cmd, Array.prototype.slice.call(arguments, 1), scope);
    } else if(msg.event) {
        this.emit.apply(this, [msg.event, scope].concat(msg.args||[]));
    } else {
        console.log('Message from', scope.pid, Array.prototype.slice.call(arguments, 1));
    }
};

exports.createCommands = function() {
    return new Commands();
};
