
var main = exports.main = function(options, cb) {
    setInterval(function(){console.log(process.pid, (+(new Date())));}, 2000);
    cb();
};
