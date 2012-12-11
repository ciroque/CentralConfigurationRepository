/**
 * Created with IntelliJ IDEA.
 * User: steve
 * Date: 12/5/12
 * Time: 8:46 PM
 * To change this template use File | Settings | File Templates.
 */

var serviceClient = new CcrServiceClient({ 'host' : 'localhost', 'port' : 38181 });

var envList = new CcrList('_envList', 'environment', serviceClient);
var appList = new CcrList('_appList', 'application', serviceClient);
var scpList = new CcrList('_scpList', 'scope', serviceClient);
var setList = new CcrList('_setList', 'setting', serviceClient);

var MANAGEMENT_ENDPOINT = 'schedule';

$(document).ready(
    function() {
        jQuery.support.cors = true;

        envList.clear();
        appList.clear();
        scpList.clear();
        setList.clear();

        envList.populate('', showError);

        $('select#_envList').change(
            function() {
                appList.populate(envList.selected(), showError);
            }
        );

        $('select#_appList').change(
            function() {
                scpList.populate(
                    envList.selected() + '/' + appList.selected(),
                    showError);
            }
        );

        $('select#_scpList').change(
            function() {
                setList.populate(
                    envList.selected() + '/' + appList.selected() + '/' + scpList.selected(),
                    showError);
            }
        );
    }
);


function showError(err) {
    alert('ERROR => ' + err);
}
