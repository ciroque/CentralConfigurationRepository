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

exports.validateSettingDocumentTests = test_case(
    {
        validDocuentPassesMuster : function(test) {

            test.expect(2);

            var valid_document = {
                key : {
                    environment : 'environment',
                    application : 'application',
                    scope : 'scope',
                    setting : 'setting'
                },
                value : 'value',
                temporalization : {
                    cache_lifetime : 600,
                    eff_date : new Date(1970, 00, 01),
                    end_date : new Date(9999, 11, 12)
                }
            };

            var validator = new parameter_validator_module.ParameterValidator();

            validator.validateSettingDocument(
                valid_document,
                function(err, result) {
                    test.ok(err === null, err);
                    test.ok(compareDeep(valid_document, result));
                    test.done();
                }
            );
        },

        documentMissingTemporalizationDatesAreDefaulted : function(test) {

            test.expect(3);

            var missing_temporalization_dates = {
                key : {
                    environment : 'environment',
                    application : 'application',
                    scope : 'scope',
                    setting : 'setting'
                },
                value : 'value',
                temporalization : {
                    cache_lifetime : 600
                }
            };

            var expected_eff_date = new Date(1970,00,01)
            var expected_end_date = new Date(9999,11,31)

            var validator = new parameter_validator_module.ParameterValidator();

            validator.validateSettingDocument(
                missing_temporalization_dates,
                function(err, document) {
                    test.ok(err === null, err);

                    test.equal(document.temporalization.eff_date + '', expected_eff_date + '');
                    test.equal(document.temporalization.end_date + '', expected_end_date + '');

                    test.done();
                }
            );
        },

        documentWithInvalidDateIsRejected : function(test) {
            test.expect(4);

            var invalid_date = {
                key : {
                    environment : 'environment',
                    application : 'application',
                    scope : 'scope',
                    setting : 'setting'
                },
                value : 'value',
                temporalization : {
                    cache_lifetime : 600,
                    eff_date : '',
                    end_date : new Date()
                }
            };

            var validator = new parameter_validator_module.ParameterValidator();

            validator.validateSettingDocument(
                invalid_date,
                function(err, document) {
                    test.ok(err !== null);

                    test.equal(err.issues.length, 1);
                    var issue = err.issues[0];

                    test.equal(issue.name, 'eff_date');
                    test.ok(issue.problem.indexOf('is an invalid date'));

                    test.done();
                }
            );
        },

        cacheLifetimeMustBeNumeric : function(test) {
            test.expect(4);

            var invalid_cache_lifetime = {
                key : {
                    environment : 'environment',
                    application : 'application',
                    scope : 'scope',
                    setting : 'setting'
                },
                value : 'value',
                temporalization : {
                    cache_lifetime : 'this is a string',
                    eff_date : new Date(),
                    end_date : new Date()
                }
            };

            var validator = new parameter_validator_module.ParameterValidator();

            validator.validateSettingDocument(
                invalid_cache_lifetime,
                function(err, document) {
                    test.ok(err !== null);

                    test.equal(err.issues.length, 1);
                    var issue = err.issues[0];

                    test.equal(issue.name, 'cache_lifetime');
                    test.ok(issue.problem.indexOf('must be numeric'));

                    test.done();
                }
            );
        },

        missingCacheLifetimeIsDefaulted : function(test) {
            test.expect(2);

            var invalid_cache_lifetime = {
                key : {
                    environment : 'environment',
                    application : 'application',
                    scope : 'scope',
                    setting : 'setting'
                },
                value : 'value',
                temporalization : {
                    eff_date : new Date(),
                    end_date : new Date()
                }
            };

            var validator = new parameter_validator_module.ParameterValidator();

            validator.validateSettingDocument(
                invalid_cache_lifetime,
                function(err, document) {
                    test.ok(err === null, err);

                    test.equal(document.temporalization.cache_lifetime, 600);

                    test.done();
                }
            );
        },

        missingKeyEnvironmentFails : function(test) {
            test.fail('needs implementation');
            test.done();
        },

        missingKeyApplicationFails : function(test) {
            test.fail('needs implementation');
            test.done();
        },

        missingKeyScopeFails : function(test) {
            test.fail('needs implementation');
            test.done();
        },

        missingKeySettingFails : function(test) {
            test.fail('needs implementation');
            test.done();
        },

        missingKeyApplicationAndScopeFails : function(test) {
            test.fail('needs implementation');
            test.done();
        }
    }
);

// lifted from http://stackoverflow.com/questions/1068834/object-comparison-in-javascript
function compareDeep(left, right) {
    if ( left === right ) return true;
    // if both x and y are null or undefined and exactly the same

    if ( ! ( left instanceof Object ) || ! ( right instanceof Object ) ) return false;
    // if they are not strictly equal, they both need to be Objects

    if ( left.constructor !== right.constructor ) return false;
    // they must have the exact same prototype chain, the closest we can do is
    // test there constructor.

    for ( var p in left ) {
        if ( ! left.hasOwnProperty( p ) ) continue;
        // other properties were tested using x.constructor === y.constructor

        if ( ! right.hasOwnProperty( p ) ) return false;
        // allows to compare x[ p ] and y[ p ] when set to undefined

        if ( left[ p ] === right[ p ] ) continue;
        // if they have the same strict value or identity then they are equal

        if ( typeof( left[ p ] ) !== "object" ) return false;
        // Numbers, Strings, Functions, Booleans must be strictly equal

        if ( ! Object.equals( left[ p ],  right[ p ] ) ) return false;
        // Objects and Arrays must be tested recursively
    }

    for ( p in right ) {
        if ( right.hasOwnProperty( p ) && ! left.hasOwnProperty( p ) ) return false;
        // allows x[ p ] to be set to undefined
    }
    return true;
}
