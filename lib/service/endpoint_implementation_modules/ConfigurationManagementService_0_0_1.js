/**
 * User: steve
 * Date: 7/20/12
 * Time: 12:41 PM
 */

var parameter_validator_module = require('../ParameterValidator');

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
            verb : 'post',
            path : '/schedule/:environment/:application/:scope/:setting',
            handler : this.handlePut
        },
        {
            verb : 'get',
            path : '/schedule/',
            handler : this.handleGet
        },
        {
            verb : 'get',
            path : '/schedule/:environment',
            handler : this.handleGet
        },
        {
            verb : 'get',
            path : '/schedule/:environment/:application',
            handler : this.handleGet
        },
        {
            verb : 'get',
            path : '/schedule/:environment/:application/:scope',
            handler : this.handleGet
        },
        {
            verb : 'get',
            path : '/schedule/:environment/:application/:scope/:setting',
            handler : this.handleGet
        }
    ];

    this.datastore = data_store;
    this.log_writer = log_writer;
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

    var self = this;

    this.datastore.retrieveSettingSchedule(
        req.params.environment,
        req.params.application,
        req.params.scope,
        req.params.setting,
        function(err, settings) {
            if(err != null) {
                self.log_writer.writeError(err);
            } else {

                var count = settings.length;

                if(count == 0) {
                    res.send(404);

                } else {
                    res.send(settings);
                }

                res.end();
            }
        }
    );
}

/**
 * Handle processing HTTP PUT requests for the registered Configuration Management endpoints.
 * @param req
 * @param res
 */
ConfigurationManagementService_0_0_1.prototype.handlePut = function(req, res) {
    this.log_writer.writeDebug('(&ConfigurationManagementService_0_0_1::handlePut&) body => ' + JSON.stringify(req.body));
    res.header('x-ccr-params', JSON.stringify(req.body));

    var document = JSON.parse(req.body);

    var validator = new parameter_validator_module.ParameterValidator();

    var self = this;

    validator.validateSettingDocument(
        document.updatedDocument,
        function(err, validated_document) {
            if(err !== null) {
                res.send(422, err);
                res.end();

            } else {
                document.updatedDocument = validated_document;
                self.datastore.updateSetting(
                    document,
                    function(err, result) {
                        if(err) {
                            self.log_writer.writeError('(&ConfigurationManagementService_0_0_1::handlePut&)[datastore.updateSetting] err => ' + JSON.stringify(err));
                            res.send(500, err); // TODO : obfuscate the actual message...

                        } else {
                            self.log_writer.writeDebug('(&ConfigurationManagementService_0_0_1::handlePut&)[datastore.updateSetting] result => ' + JSON.stringify(result));
                            res.send(200, result);
                        }

                        res.end();
                    }
                );
            }
        }
    );
};

/* *********************************************************************************************************************
 Exportation
 ******************************************************************************************************************** */

module.exports = {
    ConfigurationManagementService_0_0_1 : ConfigurationManagementService_0_0_1
}
