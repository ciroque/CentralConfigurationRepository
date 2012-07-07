/**
 * User: steve
 * Date: 7/6/12
 * Time: 1:14 PM
 */


var http_module = require('http');
var nodeunit_module = require('nodeunit');
var test_case = nodeunit_module.testCase;

var rest_server_module = require('../../lib/service/RestServer');

var REST_PORT = 8119;

var settings = {
    "service" : {
        "port" : REST_PORT
    }
};

exports.primaryTestGroup = test_case(
    {
        verifyRegisterRoute : function(test) {

            var logger = {
                writeInfo : function(message) {
                    test.ok(message.indexOf('(&RestServer::registerRoute&)') > -1);
                }
            };

            var rest_server = new rest_server_module.RestServer(settings, logger);

            rest_server.registerRoute('get', '/path', '0.0.1', function() {});

            test.done();
        },

        verifyStartAndStop : function(test) {

            var logger = {
                writeInfo : function(message) {
                    test.ok(message.indexOf('(&RestServer::') > -1);
                    console.log(message);
                }
            };

            var rest_server = new rest_server_module.RestServer(settings, logger);

            rest_server.start();

            var request_options = {
                port : REST_PORT,
                path : '/',
                method : 'HEAD'
            };

            var http_req = http_module.request(
                request_options,
                function(res) {

                    test.ok(res.headers['x-rest-ack'] = 'ACK');

                    rest_server.stop();
                    test.done();
                }
            );

            http_req.end();
        }
    }
);