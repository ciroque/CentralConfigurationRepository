/*
    LogWriter.js

    Logging implementation abstraction.    
*/
var caterpillar_module = require('caterpillar');
var os_module = require('os');

function LogWriter(settings) {
    this.log = arguments.length == 2 ? arguments[1] : new caterpillar_module.Logger();
    this.log.setLevel(settings.logging.log_level);
    this.hostname = os_module.hostname();
}

LogWriter.prototype.writeToLog = function(level) {
    var entry = new Date().toUTCString();
    entry += '\t' + this.hostname;
    for(var index = 1; index < arguments.length; index++) {
        entry += '\t' + arguments[index];
    }
    //entry += '\n';

    this.log.log(level, entry);
};

LogWriter.prototype.writeCritical = function() {
    Array.prototype.unshift.call(arguments, 2);
    this.writeToLog.apply(this, arguments);
};

LogWriter.prototype.writeError = function() {
    Array.prototype.unshift.call(arguments, 3);
    this.writeToLog.apply(this, arguments);
};

LogWriter.prototype.writeWarn = function() {
    Array.prototype.unshift.call(arguments, 4);
    this.writeToLog.apply(this, arguments);
};

LogWriter.prototype.writeInfo = function() {
    Array.prototype.unshift.call(arguments, 6);
    this.writeToLog.apply(this, arguments);
};

LogWriter.prototype.writeDebug = function() {
    Array.prototype.unshift.call(arguments, 7);
    this.writeToLog.apply(this, arguments);
};

module.exports = {
    LogWriter : LogWriter
};
