/**
 * Created with IntelliJ IDEA.
 * User: steve
 * Date: 12/10/12
 * Time: 8:56 PM
 * To change this template use File | Settings | File Templates.
 */

function CcrServiceClient(settings) {

    this.Get = function(endpoint, path, onSuccess, onError) {
        this.callService('GET', endpoint, path, {}, onSuccess, onError);
    }

    this.callService = function(verb, endpoint, path, data, onSuccess, onError) {
        var uri = 'http://' + settings.host + ':' + settings.port + '/' + endpoint + '/' + path;

        $.ajax(
            {
                type : verb,
                url : uri,
                data : data,
                contentType : 'application/json; charset=utf-8',
                dataType : 'json',
                success : onSuccess,
                error : onError
            }
        );
    }
}