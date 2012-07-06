/**
 * User: steve
 * Date: 6/17/12
 * Time: 11:50 PM
 */

var restify_module = require('restify');

function RestServer(settings, log_writer) {
    if(typeof(settings) !== 'object') {
        throw 'settings must be supplied and an instance of Ciroque.Domesticalis.RestSettings';
    }

    this.restify_server = restify_module.createServer();
    this.restify_server.use(restify_module.bodyParser({ mapParams: true })); // map body parameters into req.params
    this.restify_server.use(restify_module.queryParser({ mapParams: true })); // map body parameters into req.params

    this.settings = settings;
    this.log_writer = log_writer;

    this.registerRoute('head', '/', '0.0.1', function(req, res) { res.header('x-rest-ack', 'ACK'); res.end(); });
}

RestServer.prototype.registerRoute = function(verb, path, version, handler) {
    this.log_writer.writeInfo('(&RestServer::registerRoute&)');
    this.restify_server[verb]({ path: path, version: version }, handler);
};

RestServer.prototype.start = function() {
    this.log_writer.writeInfo('(&RestServer::start&)');
    this.restify_server.listen(this.settings.rest.port);
};

RestServer.prototype.stop = function() {
    this.log_writer.writeInfo('(&RestServer::stop&)');
    this.restify_server.close();
};

module.exports = {
    RestServer : RestServer
};