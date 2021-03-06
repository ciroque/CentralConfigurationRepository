/**
 * User: steve
 * Date: 7/31/12
 * Time: 9:32 PM
 */

var nodeunit_module = require('nodeunit');
var test_case = nodeunit_module.testCase;

var settings_module = require('n-app-conf');
var cms_0_0_1_module = require('../../lib/service/endpoint_implementation_modules/ConfigurationManagementService_0_0_1');

var settings = new settings_module.Settings('./assets/test_settings.json');

exports.primaryTestGroup = test_case(
    {
        getVersion : function(test) {
            test.expect(1);

            var mock_datastore = {
                retrieveActiveSetting : function(env, app, scope, setting, handler) {
                    handler(null);
                }
            };

            var mock_log_writer = {
                writeDebug : function() {},
                writeError : function() {}
            };

            var mock_access_stats_tracker = {
                recordQuery : function(env, app, scope, setting, handler) {
                    handler(null);
                }
            };

            var cms_0_0_1 = new cms_0_0_1_module.ConfigurationManagementService_0_0_1(
                mock_datastore,
                mock_log_writer,
                mock_access_stats_tracker,
                settings
            );

            var version = cms_0_0_1.getVersion();

            test.equal(version, '0.0.1');

            test.done();
        },

        handleGet : function(test) {
            test.expect(11);

            var result = [
                {
                    "_id": "4ff3371ca23a0ea2fecb8b87",
                    "key": {
                        "environment": "default",
                        "application": "application",
                        "scope": "scope",
                        "setting": "setting"
                    },
                    "value": "true",
                    "temporalization": {
                        "cache_lifetime": "600",
                        "eff_date": "2010-01-03T08:00:00.000Z",
                        "end_date": "9999-12-31T08:00:00.000Z"
                    }
                }
            ];

            var mock_datastore = {
                retrieveSettingSchedule : function(env, app, scope, setting, handler) {
                    handler(null, result);
                }
            };

            var mock_log_writer = {
                writeDebug : function() {
                },
                writeError : function() {
                }
            };

            var mock_access_stats_tracker = {
                recordQuery : function(env, app, scope, setting, handler) {
                    handler(null);
                }
            };

            var cms_0_0_1 = new cms_0_0_1_module.ConfigurationManagementService_0_0_1(
                mock_datastore,
                mock_log_writer,
                mock_access_stats_tracker,
                settings
            );

            var mock_req = {
                params : {
                    environment : 'default',
                    application : 'application',
                    scope : 'scope',
                    setting : 'setting'
                }
            };

            var mock_res = {
                send : function(body) {

                    test.ok(body != null);

                    var body_obj = eval(body);

                    test.equal(body_obj.length, 1);

                    var setting = body_obj[0];

                    test.equal(setting.key.environment, 'default');
                    test.equal(setting.key.application, 'application');
                    test.equal(setting.key.scope, 'scope');
                    test.equal(setting.key.setting, 'setting');

                    test.ok(setting.value != null, 'The setting should have a value');
                    test.ok(setting.temporalization != null, 'The setting should have a temporalization object.');
                    test.ok(setting.temporalization.eff_date != null, 'The setting should have an effective date.');
                    test.ok(setting.temporalization.end_date != null, 'The setting should have an end date.');
                    test.ok(setting.temporalization.cache_lifetime != null, 'The setting should have a cache lifetime.');

                },
                end : function() {
                    test.done();
                }
            };

            cms_0_0_1.handleGet(mock_req, mock_res);
        }
    }
);