/*
    Ciroque.Domesticalis.LogWriter.js
    
    Definition of the LogWriter class.
    The LogWriter class is an abstraction layer for an underlying Node logging module.
*/

var nodeunit_module = require('nodeunit');
var test_case = nodeunit_module.testCase;

var log_writer_module = require('../../lib/service/LogWriter');
var settings_module = require('../../lib/service/Settings');

var settings = new settings_module.Settings();

exports.primaryTestGroup = test_case(
    {
        basicThreeParameterLoggingCall : function(test) {
            test.expect(4);

            var first = 'first field';
            var second = 'second field';
            var third = 'third field';

            var level = 0;

            var mock_logger = {
                log : function(lvl, msg) {
                    test.equal(lvl, level);
                    test.ok(msg.indexOf(first) > 0, 'the message should contain the value: ' + first);
                    test.ok(msg.indexOf(second) > 0, 'the message should contain the value: ' + second);
                    test.ok(msg.indexOf(third) > 0, 'the message should contain the value: ' + third);
                },

                setLevel : function() {}
            };
            
            var log_writer = new log_writer_module.LogWriter(settings, mock_logger);
            
            log_writer.writeToLog(0, first, second, third);

            test.done();
        }
    }
);

exports.logLevelHelperMethodsGroup = test_case(
    {
        setUp : function(callback) {
            callback();
        },
        
        callToLogDebugSetsLevelCorrectly : function(test) {
            test.expect(4);

            var first = 'first field';
            var second = 'second field';
            var third = 'third field';

            var level = 7;

            var mock_logger = {
                log : function(lvl, msg) {
                    test.equal(lvl, level);
                    test.ok(msg.indexOf(first) > 0, 'the message should contain the value: ' + first);
                    test.ok(msg.indexOf(second) > 0, 'the message should contain the value: ' + second);
                    test.ok(msg.indexOf(third) > 0, 'the message should contain the value: ' + third);
                },

                setLevel : function() {}
            };
            
            var log_writer = new log_writer_module.LogWriter(settings, mock_logger);
            
            log_writer.writeDebug(first, second, third);

            test.done();
        },

        callToLogInfoSetsLevelCorrectly : function(test) {
            test.expect(4);

            var first = 'first field';
            var second = 'second field';
            var third = 'third field';

            var level = 6;

            var mock_logger = {
                log : function(lvl, msg) {
                    test.equal(lvl, level);
                    test.ok(msg.indexOf(first) > 0, 'the message should contain the value: ' + first);
                    test.ok(msg.indexOf(second) > 0, 'the message should contain the value: ' + second);
                    test.ok(msg.indexOf(third) > 0, 'the message should contain the value: ' + third);
                },

                setLevel : function() {}
            };

            var log_writer = new log_writer_module.LogWriter(settings, mock_logger);

            log_writer.writeInfo(first, second, third);

            test.done();
        },
        
        callToLogWarnSetsLevelCorrectly : function(test) {
            test.expect(4);

            var first = 'first field';
            var second = 'second field';
            var third = 'third field';

            var level = 4;

            var mock_logger = {
                log : function(lvl, msg) {
                    test.equal(lvl, level);
                    test.ok(msg.indexOf(first) > 0, 'the message should contain the value: ' + first);
                    test.ok(msg.indexOf(second) > 0, 'the message should contain the value: ' + second);
                    test.ok(msg.indexOf(third) > 0, 'the message should contain the value: ' + third);
                },

                setLevel : function() {}
            };
            
            var log_writer = new log_writer_module.LogWriter(settings, mock_logger);
            
            log_writer.writeWarn(first, second, third);

            test.done();
        },
        
        callToLogErrorSetsLevelCorrectly : function(test) {
            test.expect(4);

            var first = 'first field';
            var second = 'second field';
            var third = 'third field';

            var level = 3;

            var mock_logger = {
                log : function(lvl, msg) {
                    test.equal(lvl, level);
                    test.ok(msg.indexOf(first) > 0, 'the message should contain the value: ' + first);
                    test.ok(msg.indexOf(second) > 0, 'the message should contain the value: ' + second);
                    test.ok(msg.indexOf(third) > 0, 'the message should contain the value: ' + third);
                },

                setLevel : function() {}
            };
            
            var log_writer = new log_writer_module.LogWriter(settings, mock_logger);
            
            log_writer.writeError(first, second, third);

            test.done();
        },
        
        callToLogCriticalSetsLevelCorrectly : function(test) {
            test.expect(4);

            var first = 'first field';
            var second = 'second field';
            var third = 'third field';

            var level = 2;

            var mock_logger = {
                log : function(lvl, msg) {
                    test.equal(lvl, level);
                    test.ok(msg.indexOf(first) > 0, 'the message should contain the value: ' + first);
                    test.ok(msg.indexOf(second) > 0, 'the message should contain the value: ' + second);
                    test.ok(msg.indexOf(third) > 0, 'the message should contain the value: ' + third);
                },

                setLevel : function() {}
            };
            
            var log_writer = new log_writer_module.LogWriter(settings, mock_logger);
            
            log_writer.writeCritical(first, second, third);

            test.done();
        }
    }
);

