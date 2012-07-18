/**
 * User: steve
 * Date: 7/17/12
 * Time: 10:27 AM
 */

var HTTP_VERB_GET = 'get';

function ConfigurationProviderService_0_0_1(data_store, log_writer, access_stats_tracker) {
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
}

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
                if(settings.length == 0) {
                    res.send(404);

                } else {
                    self.log_writer.writeDebug('(&ConfigurationProviderService_0_0_1::handleRequest&)[data_store.retrieveActiveSetting]::settings => ' + JSON.stringify(settings));
                    res.send(settings);

                }
            }

            res.end();
        }
    );
};

module.exports = {
    ConfigurationProviderService_0_0_1 : ConfigurationProviderService_0_0_1
};