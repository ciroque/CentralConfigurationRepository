/**
 * Created with IntelliJ IDEA.
 * User: steven.wagner
 * Date: 12/10/12
 * Time: 1:09 PM
 * To change this template use File | Settings | File Templates.
 */

/* *********************************************************************************************************************
 Global Constants
 ******************************************************************************************************************** */

var HTTP_VERB_GET = 'get';

/* *********************************************************************************************************************
 Construction
 ******************************************************************************************************************** */

function BatchConfigurationProviderService_0_0_1(data_store, log_writer, access_stats_tracker, settings) {
    this.routes = [
        {
            verb : HTTP_VERB_GET,
            path : '/settings/:environment/:application',
            handler : this.handleRequest
        }
        , {
            verb : HTTP_VERB_GET,
            path : '/settings/:environment/:application/:scope',
            handler : this.handleRequest
        }
    ];

    this.data_store = data_store;
    this.log_writer = log_writer;
    this.access_stats_tracker = access_stats_tracker;
    this.default_environment = settings.defaults.default_environment;
}

/* *********************************************************************************************************************
 Public interface
 ******************************************************************************************************************** */

/**
 * Returns a string representing the semver-formatted version of this endpoint implementation module
 * @return {String}
 */
BatchConfigurationProviderService_0_0_1.prototype.getVersion = function() {
    return '0.0.1';
};

BatchConfigurationProviderService_0_0_1.prototype.handleRequest = function(req, res) {
    res.send(501, "Forthcoming");
    res.end();
}

/* *********************************************************************************************************************
 Private methods
 ******************************************************************************************************************** */

/* *********************************************************************************************************************
 Exportation
 ******************************************************************************************************************** */

module.exports = {
    BatchConfigurationProviderService_0_0_1 : BatchConfigurationProviderService_0_0_1
};
