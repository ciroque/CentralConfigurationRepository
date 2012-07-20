/**
 * User: steve
 * Date: 7/5/12
 * Time: 3:00 PM
 */

var CONFIGURATION_TEST_FILENAME = './assets/test_settings.json';

var nodeunit_module = require('nodeunit');
var test_case = nodeunit_module.testCase;

var ccr_settings_module = require('n-app-conf');

exports.datastoreSettings = test_case(
    {
        settingsFromFile : function(test) {
            test.expect(3);

            var ccr_settings = new ccr_settings_module.Settings(CONFIGURATION_TEST_FILENAME);

            test.equal(ccr_settings.data_store.database_name, 'ccr_tests');
            test.equal(ccr_settings.data_store.hostname, 'localhost');
            test.equal(ccr_settings.data_store.port  , 27017);

            test.done();
        },

        settingsFromEnvironment : function(test) {

            var database_name_override = 'database_name_override';
            var hostname_override = 'env_datastore_host';
            var port_override = 951753;

            process.env['data_store__database_name'] = database_name_override;
            process.env['data_store__hostname'] = hostname_override;
            process.env['data_store__port'] = port_override;

            test.expect(3);

            var ccr_settings = new ccr_settings_module.Settings(CONFIGURATION_TEST_FILENAME);

            test.equal(ccr_settings.data_store.database_name, database_name_override);
            test.equal(ccr_settings.data_store.hostname, hostname_override);
            test.equal(ccr_settings.data_store.port  , port_override);

            test.done();

            delete process.env['data_store__hostname'];
            delete process.env['data_store__port'];
        }
    }
);

exports.serviceSettings = test_case(
    {
        settingsFromFile : function(test) {
            test.expect(4);

            var ccr_settings = new ccr_settings_module.Settings(CONFIGURATION_TEST_FILENAME);

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

            process.env['service__protocol'] = protocol_override;
            process.env['service__hostname'] = hostname_override;
            process.env['service__port'] = port_override;
            process.env['service__endpoint_modules_directory'] = path_override;

            var ccr_settings = new ccr_settings_module.Settings(CONFIGURATION_TEST_FILENAME);

            test.equal(ccr_settings.service.protocol, protocol_override);
            test.equal(ccr_settings.service.hostname, hostname_override);
            test.equal(ccr_settings.service.port, port_override);
            test.equal(ccr_settings.service.endpoint_modules_directory, path_override);

            test.done();

            delete process.env['service__protocol'];
            delete process.env['service__hostname'];
            delete process.env['service__port'];
            delete process.env['service__endpoint_modules_directory'];
        }
    }
);

exports.loggingSettings = test_case(
    {
        settingsFromFile : function(test) {
            test.expect(2);

            var ccr_settings = new ccr_settings_module.Settings(CONFIGURATION_TEST_FILENAME);

            test.equal(ccr_settings.logging.debug_log_level, 7);
            test.equal(ccr_settings.logging.log_level, 6);

            test.done();
        },

        settingsFromEnvironment : function(test) {
            test.expect(2);

            var debug_log_level_override = 0;
            var log_level_override = -1;

            process.env['logging__debug_log_level'] = debug_log_level_override;
            process.env['logging__log_level'] = log_level_override;

            var ccr_settings = new ccr_settings_module.Settings(CONFIGURATION_TEST_FILENAME);

            test.equal(ccr_settings.logging.debug_log_level, debug_log_level_override);
            test.equal(ccr_settings.logging.log_level, log_level_override);

            test.done();

            delete process.env['logging__debug_log_level'];
            delete process.env['logging__log_level'];
        }
    }
);


exports.accessStatisticsTrackerSettings = test_case(
    {
        settingsFromFile : function(test) {
            test.expect(3);

            var ccr_settings = new ccr_settings_module.Settings(CONFIGURATION_TEST_FILENAME);

            test.equal(ccr_settings.access_statistics.connection_string, 'localhost:11211');
            test.equal(ccr_settings.access_statistics.query_key_prefix, 'ccrq');
            test.equal(ccr_settings.access_statistics.update_key_prefix, 'ccru');

            test.done();
        },

        settingsFromEnvironment : function(test) {
            test.expect(3);

            var connection_string_override = 'test_connection_string';
            var query_key_prefix = 'query_override';
            var update_key_prefix = 'update_override';

            process.env['access_statistics__connection_string'] = connection_string_override;
            process.env['access_statistics__query_key_prefix'] = query_key_prefix;
            process.env['access_statistics__update_key_prefix'] = update_key_prefix;

            var ccr_settings = new ccr_settings_module.Settings(CONFIGURATION_TEST_FILENAME);

            test.equal(ccr_settings.access_statistics.connection_string, connection_string_override);
            test.equal(ccr_settings.access_statistics.query_key_prefix, query_key_prefix);
            test.equal(ccr_settings.access_statistics.update_key_prefix, update_key_prefix);

            test.done();

            delete process.env['access_statistics__connection_string'];
            delete process.env['access_statistics__query_key_prefix'];
            delete process.env['access_statistics__update_key_prefix'];
        }
    }
);

exports.defaultSettings = test_case(
    {
        settingsFromFile : function(test) {
            test.expect(1);

            var ccr_settings = new ccr_settings_module.Settings(CONFIGURATION_TEST_FILENAME);

            test.equal(ccr_settings.defaults.default_environment, 'default');

            test.done();
        },

        settingsFromEnvironment : function(test) {
            test.expect(1);

            var default_environment = 'default_environment_override';

            process.env['defaults__default_environment'] = default_environment;

            var ccr_settings = new ccr_settings_module.Settings(CONFIGURATION_TEST_FILENAME);

            test.equal(ccr_settings.defaults.default_environment, default_environment);

            test.done();

            delete process.env['defaults__default_environment'];
        }
    }
);