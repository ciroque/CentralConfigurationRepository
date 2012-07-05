/**
 * User: steve
 * Date: 7/5/12
 * Time: 3:00 PM
 */

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
        }
    }
);

exports.restSettings = test_case(
    {
        settingsFromFile : function(test) {
            test.expect(1);

            var ccr_settings = new ccr_settings_module.Settings('./assets/test_settings.json');

            test.equal(ccr_settings.rest.port, 654321);

            test.done();
        }
    }
);