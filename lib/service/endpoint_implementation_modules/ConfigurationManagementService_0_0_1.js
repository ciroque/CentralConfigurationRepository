/**
 * User: steve
 * Date: 7/20/12
 * Time: 12:41 PM
 */

/* *********************************************************************************************************************
 Construction
 ******************************************************************************************************************** */

/**
 * Constructor for the ConfigurationManagementService_0_0_1 endpoint implementation module.
 * @param data_store
 * @param log_writer
 * @param access_stats_tracker
 * @param settings
 * @constructor
 */
function ConfigurationManagementService_0_0_1(data_store, log_writer, access_stats_tracker, settings) {
    this.routes = [
        {
            verb : 'put',
            path : '/setting/schedule/:environment/:application/:scope/:setting',
            handler : this.handlePut
        },
        {
            verb : 'get',
            path : '/setting/schedule/:environment/:application/:scope/:setting',
            handler : this.handleGet
        }
    ];
}

/* *********************************************************************************************************************
 Public interface
 ******************************************************************************************************************** */

/**
 * Returns a string representing the semver-formatted version of this endpoint implementation module
 * @return {String}
 */
ConfigurationManagementService_0_0_1.prototype.getVersion = function() {
    return '0.0.1';
};

/**
 * Handle processing HTTP GET requests for the registered Configuration Management endpoints.
 * @param req
 * @param res
 */
ConfigurationManagementService_0_0_1.prototype.handleGet = function(req, res) {
    res.end();
}

/**
 * Handle processing HTTP PUT requests for the registered Configuration Management endpoints.
 * @param req
 * @param res
 */
ConfigurationManagementService_0_0_1.prototype.handlePut = function(req, res) {
    res.end();
};

/* *********************************************************************************************************************
 Exportation
 ******************************************************************************************************************** */

module.exports = {
    ConfigurationManagementService_0_0_1 : ConfigurationManagementService_0_0_1
}