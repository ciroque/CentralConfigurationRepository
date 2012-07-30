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

    this.registerRoute(
        'head',
        '/',
        '0.0.1',
        function(req, res) {
            log_writer.writeDebug('(&RestServer::root HEAD handler&)');
            res.header('x-rest-ack', 'ACK');
            res.end();
        }
    );
}

RestServer.prototype.registerRoute = function(verb, path, version, handler) {
    this.log_writer.writeInfo('(&RestServer::registerRoute&) => ' + verb + '\t' + path + '\t' + version);
    this.restify_server[verb]({ path: path, version: version }, handler);
};

RestServer.prototype.start = function() {
    this.log_writer.writeInfo('(&RestServer::start&) port => ' + this.settings.service.port);
    this.restify_server.listen(this.settings.service.port);
    this.log_writer.writeInfo('(&RestServer::start&) STARTED!');
};

RestServer.prototype.stop = function() {
    this.log_writer.writeInfo('(&RestServer::stop&)');
    this.restify_server.close();
    this.log_writer.writeInfo('(&RestServer::start&) STOPPED!');
};

module.exports = {
    RestServer : RestServer
};