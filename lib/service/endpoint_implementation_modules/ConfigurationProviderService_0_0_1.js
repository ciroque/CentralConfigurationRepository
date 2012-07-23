/**
 * User: steve
 * Date: 7/17/12
 * Time: 10:27 AM
 */

/* *********************************************************************************************************************
 Global Constants
 ******************************************************************************************************************** */

var HTTP_VERB_GET = 'get';

/* *********************************************************************************************************************
 Construction
 ******************************************************************************************************************** */

function ConfigurationProviderService_0_0_1(data_store, log_writer, access_stats_tracker, settings) {
    this.routes = [
        {
            verb : HTTP_VERB_GET,
            path : '/setting',
            handler : this.handleRequest
        }
        , {
            verb : HTTP_VERB_GET,
            path : '/setting/:environment',
            handler : this.handleRequest
        }
        , {
            verb : HTTP_VERB_GET,
            path : '/setting/:environment/:application',
            handler : this.handleRequest
        }
        , {
            verb : HTTP_VERB_GET,
            path : '/setting/:environment/:application/:scope',
            handler : this.handleRequest
        }
        , {
            verb : HTTP_VERB_GET,
            path : '/setting/:environment/:application/:scope/:setting',
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
ConfigurationProviderService_0_0_1.prototype.getVersion = function() {
    return '0.0.1';
};

ConfigurationProviderService_0_0_1.prototype.handleRequest = function(req, res) {

    var self = this;

    this.access_stats_tracker.recordQuery(
        req.params.environment,
        req.params.application,
        req.params.scope,
        req.params.setting,
        function(err) {
            if(err != null) {
                self.log_writer.writeError('(&ConfigurationProviderService_0_0_1::handleRequest&)[access_stats_tracker.recordQuery]::err => ' + err);
            }
        }
    );

    this.data_store.retrieveActiveSetting(
        req.params.environment,
        req.params.application,
        req.params.scope,
        req.params.setting,
        function(err, settings) {
            if(err != null) {
                self.log_writer.writeError(err);
                res.send(500, err);

            } else {

                var count = settings.length;

                if(count == 0) {
                    res.send(404);

                } else if(count == 1 ) {
                    self.log_writer.writeDebug('(&ConfigurationProviderService_0_0_1::handleRequest&)[data_store.retrieveActiveSetting]::settings => ' + JSON.stringify(settings));
                    res.send(settings);

                } else {
                    self.log_writer.writeDebug('(&ConfigurationProviderService_0_0_1::handleRequest&)[data_store.retrieveActiveSetting]::settings => ' + JSON.stringify(settings));
                    for(var index = 0; index < count; index++) {
                        if(settings[index].key == self.default_environment) {
                            res.send([ settings[index] ]);

                        }
                    }

                }
            }

            res.end();
        }
    );
};

/* *********************************************************************************************************************
 Exportation
 ******************************************************************************************************************** */

module.exports = {
    ConfigurationProviderService_0_0_1 : ConfigurationProviderService_0_0_1
};