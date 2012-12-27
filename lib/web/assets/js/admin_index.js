/**
 * Created with IntelliJ IDEA.
 * User: steve
 * Date: 12/5/12
 * Time: 8:46 PM
 * To change this template use File | Settings | File Templates.
 */

var serviceClient = new CcrServiceClient(
    {
        'host' : 'localhost',
        'port' : 38181
    });

var valPanel = new CcrValuesPanel(
    '#_valueText',
    '#_cacheLiftetimeText',
    '#_effectiveDateText',
    '#_endDateText',
    '#_settingId',
    serviceClient
);

var setList = new CcrList(
    '_setList',
    'setting',
    serviceClient,
    [valPanel]);

var scpList = new CcrList(
    '_scpList',
    'scope',
    serviceClient,
    [valPanel, setList]);

var appList = new CcrList(
    '_appList',
    'application',
    serviceClient,
    [valPanel, setList, scpList]);

var envList = new CcrList(
    '_envList',
    'environment',
    serviceClient,
    [setList, scpList, appList]);

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

        $('select#_setList').change(
            function() {
                valPanel.populate(
                    envList.selected(),
                    appList.selected(),
                    scpList.selected(),
                    setList.selected(),
                    showError
                )
            }
        );

        $("#_saveBtn").click(
            function() {
                valPanel.update(
                    envList.selected(),
                    appList.selected(),
                    scpList.selected(),
                    setList.selected(),
                    showError
                );
            }
        );

        $("#_endDateText").datetimepicker();
    }
);


function showError(err) {
    alert('ERROR => ' + JSON.stringify(err));
}
