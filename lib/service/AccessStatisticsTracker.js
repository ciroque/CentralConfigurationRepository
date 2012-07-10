
var memcached_module = require('memcached');

var SEPARATOR_CHAR = '_';
var MAX_KEY_LENGTH = 250;
var EMPTY_VALUE_PLACEHOLDER = 'nul';

function AccessStatisticsTracker(logger, settings) {
    this.settings = settings;
    this.logger = logger;
}

AccessStatisticsTracker.prototype.recordQuery = function(env, app, scope, setting, handler) {
    writeToCache(
        this.settings.access_statistics.connection_string,
        this.settings.access_statistics.query_key_prefix,
        env,
        app,
        scope,
        setting,
        this.logger,
        handler);
};

AccessStatisticsTracker.prototype.recordUpdate = function(env, app, scope, setting, handler) {
    writeToCache(
        this.settings.access_statistics.connection_string,
        this.settings.access_statistics.update_key_prefix,
        env,
        app,
        scope,
        setting,
        this.logger,
        handler);
};

module.exports = {
    AccessStatisticsTracker : AccessStatisticsTracker
};

function buildKey(prfx, env, app, scope, setting) {
    return prfx + SEPARATOR_CHAR
            + getValueOrDefault(env) + SEPARATOR_CHAR
            + getValueOrDefault(app) + SEPARATOR_CHAR
            + getValueOrDefault(scope) + SEPARATOR_CHAR
            + getValueOrDefault(setting);
}
    
function getValueOrDefault(val) {
    var result = EMPTY_VALUE_PLACEHOLDER;
    if(val != undefined) {
        var re = /[\s\.]/g;
        result = val.replace(re, '');
    }

    return result;
}
    
function writeToCache(connection_string, prfx, env, app, scope, setting, logger, handler) {

    var key = buildKey(prfx, env, app, scope, setting);

    logger.writeDebug('(&AccessStatisticsTracker::writeToCache&)::key => ' + key);

    if(key.length > MAX_KEY_LENGTH) {
        handler('Key is too long, please shorten and resubmit. The max length is ' + MAX_KEY_LENGTH, null);
    }

    var cache_client = new memcached_module(connection_string);

    cache_client.add(
        key,
        0,
        0,
        function(err, value) {
            cache_client.increment(
                key,
                1,
                function(err, value) {
                    if(err != null) {
                        logger.writeError('(&AccessStatisticsTracker::writeToCache&)[cache_client.increment]::err => ' + err);
                        handler(err, null);

                    } else {
                        logger.writeDebug('(&AccessStatisticsTracker::writeToCache&)[cache_client.increment]::value => ' + value);
                        handler(null, { key : key, value : value });
                    }
                }
            );

            cache_client.end();
        }
    );
}