/**
 * Created with IntelliJ IDEA.
 * User: steve
 * Date: 12/10/12
 * Time: 8:56 PM
 * To change this template use File | Settings | File Templates.
 */

function CcrServiceClient(settings) {
    this.settings = settings;
};

CcrServiceClient.prototype.get = function(endpoint, path, onSuccess, onError) {
    this.callService('GET', endpoint, path, {}, onSuccess, onError);
};

CcrServiceClient.prototype.post = function(endpoint, path, data, onSuccess, onError) {
    // I cannot explain why this does not work calling 'callService' with a verb of POST
    // this.callService('POST', endpoint, path, data, onSuccess, onError);

    $.ajax(
        {
            type : 'POST',
            url : buildUri(this.settings.host, this.settings.port, endpoint, path),
            data : data,
            contentType : 'application/json; charset=utf-8',
            dataType : 'json',
            success : onSuccess,
            error : onError
        }
    );
};

CcrServiceClient.prototype.callService = function(verb, endpoint, path, data, onSuccess, onError) {
    jQuery.support.cors = true;

    $.ajax(
        {
            type : verb,
            url : buildUri(this.settings.host, this.settings.port, endpoint, path),
            data : data,
            contentType : 'application/json; charset=utf-8',
            dataType : verb == 'POST' ? 'jsonp' : 'json',
            success : onSuccess,
            error : onError
        }
    );
};

function buildUri(host, port, endpoint, path) {
    return 'http://'
        + host
        + ':'
        + port
        + '/ccr/'
        + endpoint + '/'
        + path;
}
