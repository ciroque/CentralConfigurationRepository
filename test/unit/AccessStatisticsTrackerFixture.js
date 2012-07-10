/*
 AccessStatisticsTrackerFixture
    
    Unit tests supporting the functionality of the AccessStatisticsTracker implementation.
*/
var nodeunit_module = require('nodeunit');

var access_statistics_module = require('../../lib/service/AccessStatisticsTracker');
var logger_module = require('../../lib/service/LogWriter');
var settings_module = require('../../lib/service/Settings');

var settings = new settings_module.Settings('./assets/test_settings.json');
var logger = new logger_module.LogWriter(settings);

var test_case = nodeunit_module.testCase;

exports.queryStatisticsLoggingTests = test_case(
    {
        setUp : function(callback) {
            callback();
        },
        
        nonExistantKeyIsCreatedAndIncremented : function(test) {
            test.expect(7);
            
            var environment = 'env';
            var application = 'app';
            var scope = 'scope';
            var setting = 'setting';
            
            var access_statistics_tracker = new access_statistics_module.AccessStatisticsTracker(settings, logger);
        
            access_statistics_tracker.recordQuery(
                environment,
                application,
                scope,
                setting,
                function(err, result) {
                    test.ok(err == null, err);
                    
                    test.ok(result.value > 0);
                    
                    test.ok(result.key.indexOf(settings.access_statistics.query_key_prefix) == 0, 'key should contain the prefix for query statistics.');
                    test.ok(result.key.indexOf(environment) > -1, 'Key should contain the environment');
                    test.ok(result.key.indexOf(application) > -1, 'Key should contain the application');
                    test.ok(result.key.indexOf(scope) > -1, 'Key should contain the scope');
                    test.ok(result.key.indexOf(setting) > -1, 'Key should contain the setting');
                    
                    test.done();
                }
            );
        }
    }
);

exports.updateStatisticsLoggingTests = test_case(
    {
        setUp : function(callback) {
            callback();
        },
        
        nonExistantKeyIsCreatedAndIncremented : function(test) {
            test.expect(7);
            
            var environment = 'env';
            var application = 'app';
            var scope = 'scope';
            var setting = 'setting';
            
            var access_statistics_tracker = new access_statistics_module.AccessStatisticsTracker(settings, logger);
        
            access_statistics_tracker.recordUpdate(
                environment,
                application,
                scope,
                setting,
                function(err, result) {
                    test.ok(err == null, err);
                    
                    test.ok(result.value > 0);
                    
                    test.ok(result.key.indexOf(settings.access_statistics.update_key_prefix) == 0, 'key should contain the prefix for query statistics.');
                    test.ok(result.key.indexOf(environment) > -1, 'Key should contain the environment');
                    test.ok(result.key.indexOf(application) > -1, 'Key should contain the application');
                    test.ok(result.key.indexOf(scope) > -1, 'Key should contain the scope');
                    test.ok(result.key.indexOf(setting) > -1, 'Key should contain the setting');
                    
                    test.done();
                }
            );
        }
    }
);