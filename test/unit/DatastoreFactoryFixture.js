/**
 * User: steve
 * Date: 7/6/12
 * Time: 4:09 PM
 */

var nodeunit_module = require('nodeunit');
var test_case = nodeunit_module.testCase;

var settings_module = require('../../lib/service/Settings');
var log_writer_module = require('../../lib/service/LogWriter');
var datastore_factory = require('../../lib/service/DatastoreFactory');

exports.primaryTestGroup = test_case(
    {
        buildDatastoreInstance : function(test) {
            test.expect(1);

            var settings = new settings_module.Settings();
            var log_writer = new log_writer_module.LogWriter(settings);

            var datastore = datastore_factory.createDatastore(settings, log_writer);

            test.ok(datastore != null);

            test.done();
        }
    }
);