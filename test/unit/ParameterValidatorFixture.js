/**
 * User: steve
 * Date: 7/20/12
 * Time: 1:07 PM
 */

var nodeunit_module = require('nodeunit');
var test_case = nodeunit_module.testCase;

var parameter_validator_module = require('../../lib/service/ParameterValidator');

exports.validateQueryPathTests = test_case(
    {
        missingEnvironmentParameterYieldsErrorDocument : function(test) {
            test.expect(6);

            var validator = new parameter_validator_module.ParameterValidator();

            var params = {
                application : 'application',
                scope : 'scope',
                setting : 'setting'
            };

            validator.validateFullSettingPath(
                params,
                function(err, doc) {
                    test.ok(doc == null, 'There should be no document.');
                    test.ok(err != null, 'There should be an error document.');

                    test.ok(err.message.indexOf('The request is invalid due to problems with the parameters specified.') >= 0);

                    test.equal(err.issues.length, 1);

                    test.equal(err.issues[0].name, 'environment');
                    test.equal(err.issues[0].problem, 'required but not present');

                }
            );

            test.done();
        },

        missingApplicationParameterYieldsErrorDocument : function(test) {
            test.expect(6);

            var validator = new parameter_validator_module.ParameterValidator();

            var params = {
                environment : 'environment',
                scope : 'scope',
                setting : 'setting'
            };

            validator.validateFullSettingPath(
                params,
                function(err, doc) {
                    test.ok(doc == null, 'There should be no document.');
                    test.ok(err != null, 'There should be an error document.');

                    test.ok(err.message.indexOf('The request is invalid due to problems with the parameters specified.') >= 0);

                    test.equal(err.issues.length, 1);

                    test.equal(err.issues[0].name, 'application');
                    test.equal(err.issues[0].problem, 'required but not present');

                }
            );

            test.done();
        },

        missingScopeParameterYieldsErrorDocument : function(test) {
            test.expect(6);

            var validator = new parameter_validator_module.ParameterValidator();

            var params = {
                environment : 'environment',
                application : 'application',
                setting : 'setting'
            };

            validator.validateFullSettingPath(
                params,
                function(err, doc) {
                    test.ok(doc == null, 'There should be no document.');
                    test.ok(err != null, 'There should be an error document.');

                    test.ok(err.message.indexOf('The request is invalid due to problems with the parameters specified.') >= 0);

                    test.equal(err.issues.length, 1);

                    test.equal(err.issues[0].name, 'scope');
                    test.equal(err.issues[0].problem, 'required but not present');

                }
            );

            test.done();
        },

        missingSettingParameterYieldsErrorDocument : function(test) {
            test.expect(6);

            var validator = new parameter_validator_module.ParameterValidator();

            var params = {
                environment : 'environment',
                application : 'application',
                scope : 'scope'
            };

            validator.validateFullSettingPath(
                params,
                function(err, doc) {
                    test.ok(doc == null, 'There should be no document.');
                    test.ok(err != null, 'There should be an error document.');

                    test.ok(err.message.indexOf('The request is invalid due to problems with the parameters specified.') >= 0);

                    test.equal(err.issues.length, 1);

                    test.equal(err.issues[0].name, 'setting');
                    test.equal(err.issues[0].problem, 'required but not present');

                }
            );

            test.done();
        },

        multipleMissingParametersYieldErrorDocument : function(test) {
            test.expect(10);

            var validator = new parameter_validator_module.ParameterValidator();

            var params = {
                environment : 'environment',
            };

            validator.validateFullSettingPath(
                params,
                function(err, doc) {
                    test.ok(doc == null, 'There should be no document.');
                    test.ok(err != null, 'There should be an error document.');

                    test.ok(err.message.indexOf('The request is invalid due to problems with the parameters specified.') >= 0);

                    test.equal(err.issues.length, 3);

                    var missing_keys = ['application', 'scope', 'setting'];

                    for(var index = 0; index < missing_keys.length; index++) {
                        test.equal(err.issues[index].name, missing_keys[index]);
                        test.equal(err.issues[index].problem, 'required but not present');
                    }
                }
            );

            test.done();
        },

        allValidParametersYieldQueryDocument : function(test) {
            test.expect(10);

            var validator = new parameter_validator_module.ParameterValidator();

            var params = {
                environment : 'environment',
                application : 'application',
                scope : 'scope',
                setting : 'setting'
            };

            validator.validateFullSettingPath(
                params,
                function(err, doc) {
                    test.ok(err == null, 'There should be no error document.');
                    test.ok(doc != null, 'There should be a query document.');

                    Object.keys(params).forEach(
                        function(key) {
                            test.ok(doc[key] != null);
                            test.equal(key, doc[key]);
                        }
                    );
                }
            );

            test.done();
        }
    }
);