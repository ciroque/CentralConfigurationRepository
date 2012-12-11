/**
 * User: steve
 * Date: 7/17/12
 * Time: 10:04 AM
 */

/* *********************************************************************************************************************
 Construction
 ******************************************************************************************************************** */

function EndpointRegistrar() {

}

/* *********************************************************************************************************************
 Public interface
 ******************************************************************************************************************** */

EndpointRegistrar.prototype.registerRoutes = function(endpoint_implementation, rest_server) {
    endpoint_implementation.routes.forEach(
        function(route) {

            var bound_handler = route.handler.bind(endpoint_implementation);

            rest_server.registerRoute(
                route.verb,
                route.path,
                endpoint_implementation.getVersion(),
                bound_handler);
        }
    );
};

/* *********************************************************************************************************************
 Exportation
 ******************************************************************************************************************** */

module.exports = {
    EndpointRegistrar : EndpointRegistrar
}