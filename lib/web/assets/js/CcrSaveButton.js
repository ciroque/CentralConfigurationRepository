/**
 * Created with IntelliJ IDEA.
 * User: steve
 * Date: 12/26/12
 * Time: 10:09 PM
 * To change this template use File | Settings | File Templates.
 */

function CcrSaveButton() {
};

CcrSaveButton.prototype.enable = function() {
    $(' #_saveBtn').removeAttr('disabled');
};

CcrSaveButton.prototype.disable = function() {
    $('#_saveBtn').attr('disabled', 'disabled');
};
