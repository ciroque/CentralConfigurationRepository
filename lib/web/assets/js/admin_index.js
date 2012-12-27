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

var msgPanel = new CcrMessagePanel();
var saveButton = new CcrSaveButton();

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

        saveButton.disable();
        envList.populate('', showError);

        $('select#_envList').change(
            function() {
                saveButton.disable();
                appList.populate(envList.selected(), showError);
            }
        );

        $('select#_appList').change(
            function() {
                saveButton.disable();
                scpList.populate(
                    envList.selected() + '/' + appList.selected(),
                    showError);
            }
        );

        $('select#_scpList').change(
            function() {
                saveButton.disable();
                setList.populate(
                    envList.selected() + '/' + appList.selected() + '/' + scpList.selected(),
                    showError);
            }
        );

        $('select#_setList').change(
            function() {
                saveButton.disable();
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
                    showSuccess,
                    showError
                );
            }
        );

        $('#_valueText').change(
            function() {
                saveButton.enable();
            }
        );

        $('#_cacheLiftetimeText').change(
            function() {
                saveButton.enable();
            }
        );

        $('#_effectiveDateText').change(
            function() {
                saveButton.enable();
            }
        );

        $('#_endDateText').change(
            function() {
                saveButton.enable();
            }
        );

        $("#_effDateText").datetimepicker();
        $("#_endDateText").datetimepicker();
    }
);


function showError(err) {
    var message = err.status + '  ' + err.statusText;
    msgPanel.showError(message);
}

function showSuccess(result) {
    msgPanel.showSuccess(result.displayMessage);
}