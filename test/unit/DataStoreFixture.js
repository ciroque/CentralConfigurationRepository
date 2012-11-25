/**
 * User: steve
 * Date: 7/16/12
 * Time: 2:59 PM
 */

var TEST_SETTINGS_PATH = './assets/test_settings.json';

var nodeunit_module = require('nodeunit');
var test_case = nodeunit_module.testCase;

var settings_module = require('n-app-conf');
var log_writer_module = require('../../lib/service/LogWriter');

var data_store_factory = require('../../lib/service/DataStoreFactory');

exports.retrieveActiveSettingTests = test_case(
    {
        setUp : function(callback) {

            process.env['logging__log_level'] = 7;

            this.settings = new settings_module.Settings(TEST_SETTINGS_PATH);
            this.log_writer = new log_writer_module.LogWriter(this.settings);
            this.data_store = data_store_factory.createDataStore(this.settings, this.log_writer);
            callback();
        },

        tearDown : function(callback) {
            delete process.env['logging__log_level'];
            callback();
        },

        noParametersReturnsListOfEnvironments : function(test) {
            var self = this;

            this.data_store.retrieveActiveSetting(
                null,
                null,
                null,
                null,
                function(err, settings) {
                    test.expect(2 + settings.length);
                    test.ok(err == null, err);
                    test.equal(settings.length, 3);

                    self.log_writer.writeDebug(JSON.stringify(settings));

                    for(var index = 0; index < settings.length; index++) {
                        test.ok(settings[index].key.environment != null);
                    }

                    test.done();
                }
            );
        },

        environmentParameterReturnsListOfApplications : function(test) {


            var self = this;

            this.data_store.retrieveActiveSetting(
                'environment',
                null,
                null,
                null,
                function(err, settings) {

                    test.expect(2 + settings.length);

                    test.ok(err == null, err);

                    test.equal(settings.length, 3);

                    self.log_writer.writeDebug(JSON.stringify(settings));

                    for(var index = 0; index < settings.length; index++) {
                        test.ok(settings[index].key.application != null);
                    }

                    test.done();
                }
            );


        },

        environmentApplicationParametersReturnListOfScopes : function(test) {
            test.expect(3);

            var self = this;

            this.data_store.retrieveActiveSetting(
                'environment',
                'application',
                null,
                null,
                function(err, settings) {
                    test.ok(err == null, err);

                    test.equal(settings.length, 1);

                    self.log_writer.writeDebug(JSON.stringify(settings));

                    var setting = settings[0];

                    test.ok(setting.key.scope != null);

                    test.done();
                }
            );


        },

        environmentApplicationScopeParametersReturnListOfSettings : function(test) {
            test.expect(3);

            var self = this;

            this.data_store.retrieveActiveSetting(
                'environment',
                'application',
                'scope',
                null,
                function(err, settings) {
                    test.ok(err == null, err);

                    test.equal(settings.length, 1);

                    self.log_writer.writeDebug(JSON.stringify(settings));

                    var setting = settings[0];

                    test.ok(setting.key.setting != null);

                    test.done();
                }
            );


        },

        oneSettingIsReturnedWhenNoDefaultIsPresent : function(test) {

            test.expect(3);


            this.data_store.retrieveActiveSetting(
                'environment',
                'application',
                'scope',
                'setting',
                function(err, settings) {

                    test.ok(err == null, err);

                    test.equal(settings.length, 1);

                    var setting = settings[0];

                    test.equal(setting.value, 'the_value');

                    test.done();
                }
            );
        },

        twoSettingsAreReturnedWhenDefaultIsPresent : function(test) {

            test.expect(4);

            var self = this;

            this.data_store.retrieveActiveSetting(
                'prod',
                'application2',
                'scope',
                'setting',
                function(err, settings) {

                    self.log_writer.writeDebug(JSON.stringify(settings));

                    test.ok(err == null, err);

                    test.equal(settings.length, 2);

                    var setting = settings[0];
                    test.equal(setting.key.environment, 'default');

                    var setting = settings[1];
                    test.equal(setting.key.environment, 'prod');

                    test.done();
                }
            );
        }
    }
);

exports.retrieveSettingScheduleTests = test_case(
    {
        setUp : function(callback) {

            process.env['logging__log_level'] = 7;

            this.settings = new settings_module.Settings(TEST_SETTINGS_PATH);
            this.log_writer = new log_writer_module.LogWriter(this.settings);
            this.data_store = data_store_factory.createDataStore(this.settings, this.log_writer);
            callback();
        },

        tearDown : function(callback) {
            delete process.env['logging__log_level'];
            callback();
        },

        noParametersReturnsListOfEnvironments : function(test) {
            var self = this;

            this.data_store.retrieveSettingSchedule(
                null,
                null,
                null,
                null,
                function(err, settings) {
                    test.expect(2 + settings.length);
                    test.ok(err == null, err);
                    test.equal(settings.length, 3);

                    self.log_writer.writeDebug(JSON.stringify(settings));

                    for(var index = 0; index < settings.length; index++) {
                        test.ok(settings[index].key.environment != null);
                    }

                    test.done();
                }
            );
        },

        environmentParameterReturnsListOfApplications : function(test) {

            var self = this;

            this.data_store.retrieveSettingSchedule(
                'environment',
                null,
                null,
                null,
                function(err, settings) {

                    test.expect(2 + settings.length);

                    test.ok(err == null, err);

                    test.equal(settings.length, 3);

                    self.log_writer.writeDebug(JSON.stringify(settings));

                    for(var index = 0; index < settings.length; index++) {
                        test.ok(settings[index].key.application != null);
                    }

                    test.done();
                }
            );
        },

        environmentApplicationParametersReturnListOfScopes : function(test) {
            test.expect(3);

            var self = this;

            this.data_store.retrieveSettingSchedule(
                'environment',
                'application',
                null,
                null,
                function(err, settings) {
                    test.ok(err == null, err);

                    test.equal(settings.length, 1);

                    self.log_writer.writeDebug(JSON.stringify(settings));

                    var setting = settings[0];

                    test.ok(setting.key.scope != null);

                    test.done();
                }
            );
        },

        environmentApplicationScopeParametersReturnListOfSettings : function(test) {
            test.expect(3);

            var self = this;

            this.data_store.retrieveSettingSchedule(
                'environment',
                'application',
                'scope',
                null,
                function(err, settings) {
                    test.ok(err == null, err);

                    test.equal(settings.length, 1);

                    self.log_writer.writeDebug(JSON.stringify(settings));

                    var setting = settings[0];

                    test.ok(setting.key.setting != null);

                    test.done();
                }
            );
        },

        oneSettingIsReturnedWhenNoDefaultIsPresent : function(test) {

            test.expect(3);


            this.data_store.retrieveSettingSchedule(
                'environment',
                'application',
                'scope',
                'setting',
                function(err, settings) {

                    test.ok(err == null, err);

                    test.equal(settings.length, 1);

                    var setting = settings[0];

                    test.equal(setting.value, 'the_value');

                    test.done();
                }
            );
        },

        returnFullSchedule : function(test) {

            this.data_store.retrieveSettingSchedule(
                'prod',
                'application3',
                'scope',
                'setting',
                function(err, settings) {

                    test.expect(2 + (settings.length * 5));

                    test.ok(err == null, err);

                    test.equal(settings.length, 3);

                    settings.forEach(
                        function(setting) {
                            test.equal(setting.value, 'the_value');

                            test.equal(setting.key.environment, 'prod');
                            test.equal(setting.key.application, 'application3');
                            test.equal(setting.key.scope, 'scope');
                            test.equal(setting.key.setting, 'setting');
                        }
                    );

                    test.done();
                }
            );
        }
    }
);