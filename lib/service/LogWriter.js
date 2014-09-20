/*
    LogWriter.js

    Logging implementation abstraction.    
*/
var caterpillar_module = require('caterpillar');
var caterpillar_human_module = require('caterpillar-human');
var os_module = require('os');

/* *********************************************************************************************************************
 Construction
 ******************************************************************************************************************** */

function LogWriter(settings) {
    this.log = arguments.length == 2 ? arguments[1] : new caterpillar_module.createLogger({level: settings.logging.log_level});
//    this.log.pipe(process.stdout);
    this.log.pipe(caterpillar_human_module.createHuman()).pipe(process.stdout);
    this.log.pipe(require('fs').createWriteStream('./debug.log'));
    this.hostname = os_module.hostname();
    return this;
}

/* *********************************************************************************************************************
 Public interface
 ******************************************************************************************************************** */

LogWriter.prototype.writeToLog = function(level) {
    var entry = new Date().toUTCString();
    entry += '\t' + this.hostname;
    for(var index = 1; index < arguments.length; index++) {
        entry += '\t' + arguments[index];
    }
    //entry += '\n';

    this.log.log(arguments);
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

/* *********************************************************************************************************************
 Exportation
 ******************************************************************************************************************** */

module.exports = {
    LogWriter : LogWriter
};
