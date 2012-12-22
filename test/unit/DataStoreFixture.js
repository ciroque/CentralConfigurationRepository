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

var datastore_factory = require('../../lib/service/DataStoreFactory');

exports.retrieveActiveSettingTests = test_case(
    {
        setUp : function(callback) {

            process.env['logging__log_level'] = 7;

            this.settings = new settings_module.Settings(TEST_SETTINGS_PATH);
            this.log_writer = new log_writer_module.LogWriter(this.settings);
            this.datastore = datastore_factory.createDataStore(this.settings, this.log_writer);

            callback();
        },

        tearDown : function(callback) {
            delete process.env['logging__log_level'];
            callback();
        },

        noParametersReturnsListOfEnvironments : function(test) {
            var self = this;

            this.datastore.retrieveActiveSetting(
                null,
                null,
                null,
                null,
                function(err, settings) {
                    test.expect(2 + settings.length);
                    test.ok(err == null, err);
                    test.equal(settings.length, 4);

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

            this.datastore.retrieveActiveSetting(
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

            this.datastore.retrieveActiveSetting(
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

            this.datastore.retrieveActiveSetting(
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


            this.datastore.retrieveActiveSetting(
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

            this.datastore.retrieveActiveSetting(
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
            this.datastore = datastore_factory.createDataStore(this.settings, this.log_writer);
            callback();
        },

        tearDown : function(callback) {
            delete process.env['logging__log_level'];
            callback();
        },

        noParametersReturnsListOfEnvironments : function(test) {
            var self = this;

            this.datastore.retrieveSettingSchedule(
                null,
                null,
                null,
                null,
                function(err, settings) {
                    test.expect(2 + settings.length);
                    test.ok(err == null, err);
                    test.equal(settings.length, 4);

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

            this.datastore.retrieveSettingSchedule(
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

            this.datastore.retrieveSettingSchedule(
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

            this.datastore.retrieveSettingSchedule(
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


            this.datastore.retrieveSettingSchedule(
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

            this.datastore.retrieveSettingSchedule(
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

var test_document = {
    key : {
        environment : "update_tests_env",
        application : "update_tests_app",
        scope : "update_tests_scope",
        setting : "update_tests_setting"
    },
    value : "original",
    temporalization : {
        cache_lifetime : 100,
        eff_date : new Date(1970, 00, 01),
        end_date : new Date(9999, 11, 31)
    }
};

var update_document = {
    "originalDocument": {
        "_id": "50c95b2b685ad63bebc9d82e",
        "key": {
            environment : "update_tests_env",
            application : "update_tests_app",
            scope : "update_tests_scope",
            setting : "update_tests_setting"
        },
        "value": "servername=thedatabase",
        "temporalization": {
            "cache_lifetime": 600,
            "eff_date": "1970-01-01T00:00:00.000Z",
            "end_date": "9999-12-31T08:00:00.000Z"
        }
    },
    "updatedDocument": {
        "key": {
            environment : "update_tests_env",
            application : "update_tests_app",
            scope : "update_tests_scope",
            setting : "update_tests_setting"
        },
        "value": "servername=thedatabase",
        "temporalization": {
            "cache_lifetime": "600",
            "eff_date": new Date(1968, 04, 31),
            "end_date": new Date(2012, 04, 31)
        }
    }
};

exports.updateSettingsTests = test_case(
    {
        //
        // cases:
        // - e

        setUp : function(callback) {
            process.env['logging__log_level'] = 7;

            this.settings = new settings_module.Settings(TEST_SETTINGS_PATH);
            this.log_writer = new log_writer_module.LogWriter(this.settings);
            this.datastore = datastore_factory.createDataStore(this.settings, this.log_writer);

            var ctxt = this;

            this.datastore.insertSetting(
                test_document,
                function(err, result) {
                    if(err) {
                        ctxt.log_writer.writeError(err);
                    } else {
                        ctxt.log_writer.writeDebug(result);
                    }

                    callback();
                }
            );


        },

        tearDown : function(callback) {

            var ctxt = this;

            this.datastore.deleteSetting(
                test_document.key,
                function(err, result) {
                    if(err) {
                        ctxt.log_writer.writeError(err);
                    } else {
                        ctxt.log_writer.writeDebug(result);
                    }

                    delete process.env['logging__log_level'];
                    callback();
                }
            );
        },

        updateCacheLifetime : function(test) {
            test.expect(5);

            var ctxt = this;

            this.datastore.updateSetting(
                update_document,
                function(err, result) {
                    test.ok(err == null, err);

                    ctxt.log_writer.writeInfo('updateSettingsTests >> updateSetting >> result == ' + JSON.stringify(result));
                    test.equal(result.value, update_document.updatedDocument.value);
                    test.equal(result.temporalization.cache_lifetime, update_document.updatedDocument.temporalization.cache_lifetime);
                    test.ok((result.temporalization.eff_date + '') == (update_document.updatedDocument.temporalization.eff_date + ''));
                    test.equal((result.temporalization.end_date + ''), (update_document.updatedDocument.temporalization.end_date + ''));

                    test.done();
                }
            );
        }
    }
);