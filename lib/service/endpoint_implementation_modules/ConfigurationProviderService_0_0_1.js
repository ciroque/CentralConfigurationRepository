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
        path : '/ccr/setting',
        handler : this.handleRequest
    }
    , {
        verb : HTTP_VERB_GET,
        path : '/ccr/setting/:environment',
        handler : this.handleRequest
    }
    , {
        verb : HTTP_VERB_GET,
        path : '/ccr/setting/:environment/:application',
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

    var all_parameters_provided =   req.params.environment
                                    && req.params.application
                                    && req.params.scope
                                    && req.params.setting;

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

                self.log_writer.writeDebug('(&ConfigurationProviderService_0_0_1::handleRequest&)[data_store.retrieveActiveSetting]::count => ' + count);

                if(count == 0) {
                    res.send(404);

                } else if(count == 1 ) {
                    self.log_writer.writeDebug('(&ConfigurationProviderService_0_0_1::handleRequest&)[data_store.retrieveActiveSetting]::setting => ' + JSON.stringify(settings));
                    res.send(settings);

                } else {

                    self.log_writer.writeDebug('(&ConfigurationProviderService_0_0_1::handleRequest&)[data_store.retrieveActiveSetting]::all_parameters_provided(' + all_parameters_provided + ')::settings(' + JSON.stringify(settings) + ')');

                    // full path should send only the actual setting, not the default
                    if(all_parameters_provided) {

                        var index = findSettingToSend(settings, req.params.environment, self.default_environment, self);

                        if(index > -1 && index < count) {
                            self.log_writer.writeDebug('(&ConfigurationProviderService_0_0_1::handleRequest&)[data_store.retrieveActiveSetting]::settings => ' + settings[index]);
                            res.send( [ settings[index] ]);

                        } else {
                            self.log_writer.writeDebug('(&ConfigurationProviderService_0_0_1::handleRequest&)[data_store.retrieveActiveSetting]::404');
                            res.send(404)
                        }

                    } else {
                        res.send(settings);
                    }
                }
            }

            res.end();
        }
    );
};

/* *********************************************************************************************************************
 Private methods
 ******************************************************************************************************************** */

function findSettingToSend(settings, requested_environment, default_environment) {

    var default_index = -1;

    for(var index = 0; index < settings.length; index++) {
        switch(settings[index].key.environment) {
            case requested_environment: {
                return index;
            }

            case default_environment: {
                default_index = index;
            }
        }
    }

    return default_index;
}

/* *********************************************************************************************************************
 Exportation
 ******************************************************************************************************************** */

module.exports = {
    ConfigurationProviderService_0_0_1 : ConfigurationProviderService_0_0_1
};
