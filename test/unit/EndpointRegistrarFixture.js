/**
 * User: steve
 * Date: 7/17/12
 * Time: 9:52 AM
 */

var endpoint_registrar_module = require('../../lib/service/EndpointRegistrar');

var nodeunit_module = require('nodeunit');
var test_case = nodeunit_module.testCase;

var mock_endpoint_implementation = function() {
    this.handler = function(req, res, next) {};
    this.routes = [ { verb : 'get', path : '/path1', handler : this.handler } ];
    this.getVersion = function() { return '0.0.1α' };
};

exports.primaryTestGroup = test_case(
    {
        routesAreRegistered : function(test) {
            test.expect(3);

            var mock_rest_server = {
                registerRoute : function(verb, path, version, handler) {
                    test.equal(verb, 'get');
                    test.equal(path, '/path1');
                    test.equal(typeof(handler), 'function');
                }
            };

            var endpoint_registrar = new endpoint_registrar_module.EndpointRegistrar();

            endpoint_registrar.registerRoutes(new mock_endpoint_implementation(), mock_rest_server);

            test.done();
        }
    }
);