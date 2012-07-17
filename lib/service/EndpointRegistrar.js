/**
 * User: steve
 * Date: 7/17/12
 * Time: 10:04 AM
 */

function EndpointRegistrar() {

}

EndpointRegistrar.prototype.registerRoutes = function(endpoint_implementation, rest_server) {
    endpoint_implementation.routes.forEach(
        function(route) {
            rest_server.registerRoute(
                route.verb,
                route.path,
                endpoint_implementation.getVersion(),
                route.handler);
        }
    );
};

module.exports = {
    EndpointRegistrar : EndpointRegistrar
}