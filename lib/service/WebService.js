/**
 * User: steve
 * Date: 7/5/12
 * Time: 2:27 PM
 */

var filesystem_module = require('fs');

var access_statistics_tracker_module = require('./AccessStatisticsTracker');
var endpoint_registrar_module = require('./EndpointRegistrar');
var settings_module = require('n-app-conf');
var log_writer_module = require('./LogWriter');
var data_store_factory = require('./DataStoreFactory');
var rest_server_module = require('./RestServer');

function WebService() {

}

WebService.prototype.run = function() {
    var settings = new settings_module.Settings('./settings.json');
    var log_writer = new log_writer_module.LogWriter(settings);

    log_writer.writeInfo('Creating Datastore...');
    var datastore = data_store_factory.createDataStore(settings, log_writer);

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

                var endpoint_registrar = new endpoint_registrar_module.EndpointRegistrar();

                files.forEach(
                    function(file) {
                        var cls = file.substr(0, file.indexOf('.'));

                        log_writer.writeInfo('Registering implementation module ' + cls);
                        var module = require(service_implementations_path + file);
                        var instance = new module[cls](datastore, log_writer, access_statistics_tracker);

                        endpoint_registrar.registerRoutes(instance, rest_server);

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
