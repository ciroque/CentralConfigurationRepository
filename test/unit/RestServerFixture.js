/**
 * User: steve
 * Date: 7/6/12
 * Time: 1:14 PM
 */


var http_module = require('http');
var nodeunit_module = require('nodeunit');
var test_case = nodeunit_module.testCase;

var settings_module = require('n-app-conf');
var log_writer_module = require('../../lib/service/LogWriter');
var rest_server_module = require('../../lib/service/RestServer');

var REST_PORT = 38189;

exports.primaryTestGroup = test_case(
    {
        setUp : function(callback) {
            process.env['service__port'] = REST_PORT;
            this.settings = new settings_module.Settings('./assets/test_settings.json');
            callback();
        },

        tearDown : function(callback) {
            delete process.env['service__port'];
            callback();
        },

        verifyRegisterRoute : function(test) {

            var logger = {
                writeInfo : function(message) {
                    test.ok(message.indexOf('(&RestServer::registerRoute&)') > -1);
                },

                writeDebug : function(message) {
                    test.ok(message.indexOf('(&RestServer::registerRoute&)') > -1);
                }
            };

            var rest_server = new rest_server_module.RestServer(this.settings, logger);

            rest_server.registerRoute('get', '/path', '0.0.1', function() {});

            test.done();
        }

        , verifyStartAndStop : function(test) {

            var log_writer = new log_writer_module.LogWriter(this.settings);

            var logger = {
                writeInfo : function(message) {
                    test.ok(message.indexOf('(&RestServer::') > -1);
                    log_writer.writeInfo(message);
                },

                writeDebug : function(message) {
                    test.ok(message.indexOf('(&RestServer::') > -1);
                    log_writer.writeDebug(message);
                }
            };

            var rest_server = new rest_server_module.RestServer(this.settings, logger);

            rest_server.start();

            var request_options = {
                host : '127.0.0.1',
                port : REST_PORT,
                path : '/',
                method : 'head'
            };

            var http_req = http_module.request(
                request_options,
                function(res) {

                    test.ok(res.headers['x-rest-ack'] == 'ACK');

                    rest_server.stop();
                    test.done();
                }
            );

            http_req.on('error', function(error) { console.log('ACK!! Error => ' + error) });

            http_req.end();
        }
    }
);