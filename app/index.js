
var main = exports.main = function(options, cb) {
    setInterval(function(){console.log(process.pid, (+(new Date())));}, 2000);
    //setTimeout(function(){throw new Error('Test Error');}, 7000);
    //setTimeout(function(){process.exit(0);}, 10000);
    cb();
};
