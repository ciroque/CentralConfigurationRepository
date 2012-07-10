/**
 * User: steve
 * Date: 7/5/12
 * Time: 3:00 PM
 */

var test_configuration_file = './assets/test_settings.json';

var nodeunit_module = require('nodeunit');
var test_case = nodeunit_module.testCase;

var ccr_settings_module = require('../../lib/service/Settings');

exports.datastoreSettings = test_case(
    {
        settingsFromFile : function(test) {
            test.expect(2);

            var ccr_settings = new ccr_settings_module.Settings('./assets/test_settings.json');

            test.equal(ccr_settings.datastore.hostname, 'datastore_host');
            test.equal(ccr_settings.datastore.port  , 123456);

            test.done();
        },

        settingsFromEnvironment : function(test) {
            process.env['datastore:hostname'] = 'env_datastore_host';
            process.env['datastore:port'] = 951753;

            test.expect(2);

            var ccr_settings = new ccr_settings_module.Settings('./assets/test_settings.json');

            test.equal(ccr_settings.datastore.hostname, 'env_datastore_host');
            test.equal(ccr_settings.datastore.port  , 951753);

            test.done();

            process.env['datastore:hostname'] = null;
            process.env['datastore:port'] = null;
        }
    }
);

exports.serviceSettings = test_case(
    {
        settingsFromFile : function(test) {
            test.expect(4);

            var ccr_settings = new ccr_settings_module.Settings(test_configuration_file);

            test.equal(ccr_settings.service.protocol, 'http');
            test.equal(ccr_settings.service.hostname, 'localhost');
            test.equal(ccr_settings.service.port, 65533);
            test.equal(ccr_settings.service.endpoint_modules_directory, './endpoint_implementations');

            test.done();
        },

        settingsFromEnvironment : function(test) {
            test.expect(4);

            var protocol_override = 'prot';
            var hostname_override = 'service_host';
            var port_override = 654951;
            var path_override = '/opt/yeah';

            process.env['service:protocol'] = protocol_override;
            process.env['service:hostname'] = hostname_override;
            process.env['service:port'] = port_override;
            process.env['service:endpoint_modules_directory'] = path_override;

            var ccr_settings = new ccr_settings_module.Settings(test_configuration_file);

            test.equal(ccr_settings.service.protocol, protocol_override);
            test.equal(ccr_settings.service.hostname, hostname_override);
            test.equal(ccr_settings.service.port, port_override);
            test.equal(ccr_settings.service.endpoint_modules_directory, path_override);

            test.done();

            process.env['service:port'] = null;
            process.env['service:endpoint_modules_directory'] = null;
        }
    }
);

exports.loggingSettings = test_case(
    {
        settingsFromFile : function(test) {
            test.expect(2);

            var ccr_settings = new ccr_settings_module.Settings('./assets/test_settings.json');

            test.equal(ccr_settings.logging.debug_log_level, 7);
            test.equal(ccr_settings.logging.log_level, 6);

            test.done();
        },

        settingsFromEnvironment : function(test) {
            test.expect(2);

            var debug_log_level_override = 0;
            var log_level_override = -1;

            process.env['logging:debug_log_level'] = debug_log_level_override;
            process.env['logging:log_level'] = log_level_override;

            var ccr_settings = new ccr_settings_module.Settings('./assets/test_settings.json');

            test.equal(ccr_settings.logging.debug_log_level, debug_log_level_override);
            test.equal(ccr_settings.logging.log_level, log_level_override);

            test.done();

            process.env['rest:port'] = null;
        }
    }
);

