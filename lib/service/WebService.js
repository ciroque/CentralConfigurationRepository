/**
 * User: steve
 * Date: 7/5/12
 * Time: 2:27 PM
 */

var filesystem_module = require('fs');

var access_statistics_tracker_module = require('./AccessStatisticsTracker');
var settings_module = require('./Settings');
var log_writer_module = require('./LogWriter');
var datastore_factory = require('./DataStoreFactory');
var rest_server_module = require('./RestServer');

function WebService() {

}

WebService.prototype.run = function() {
    var settings = new settings_module.Settings();
    var log_writer = new log_writer_module.LogWriter(settings);

    log_writer.writeInfo('Creating Datastore...');
    var datastore = datastore_factory.createDataStore(settings, log_writer);

    log_writer.writeInfo('Creating RestServer...');
    var rest_server = new rest_server_module.RestServer(settings, log_writer);

    log_writer.writeInfo('Creating AccessStatisticsTracker...');
    var access_statistics_tracker = new access_statistics_tracker_module.AccessStatisticsTracker(settings, log_writer);

    log_writer.writeInfo('Loading endpoint implementation modules...');
    filesystem_module.readdir(
        settings.service.endpoint_modules_directory,
        function(err, files) {
            if(err != null) {
                log_writer.writeError(err);

            } else {

                log_writer.writeInfo('Found ' + files.length + ' implementation modules...');
                files.forEach(
                    function(file) {
                        var cls = file.substr(0, file.indexOf('.'));

                        log_writer.writeInfo('Registering implementation module ' + cls);
                        var module = require(service_implementations_path + file);
                        var instance = new module[cls](datastore, log_writer, access_statistics_tracker);
                        instance.configureServer(rest_server);
                        implementations.push(instance);
                    }
                );

                log_writer.writeInfo('Starting RestifyServer...');
                rest_server.start();

                log_writer.writeInfo('Service started. Endpoints are now available.');
            }
        }
    );
};

module.exports = {
    WebService : WebService
};
