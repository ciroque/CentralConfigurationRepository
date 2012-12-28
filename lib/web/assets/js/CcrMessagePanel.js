/**
 * Created with IntelliJ IDEA.
 * User: steve
 * Date: 12/26/12
 * Time: 9:12 PM
 * To change this template use File | Settings | File Templates.
 */

var Ccr = {};

CcrMessagePanel = function() {
    this.self = this;
};

CcrMessagePanel.prototype.showMessage = function(level, message) {
    $("<div/>", { class : level + '-result seccont', html : message })
        .hide()
        .prependTo("body")
        .slideDown('fast')
        .delay(10000)
        .slideUp(function() { $(this).remove(); });
};

CcrMessagePanel.prototype.showError = function(message) {
    this.showMessage('error', message);
};

CcrMessagePanel.prototype.showSuccess = function(message) {
    this.showMessage('success', message);
};

CcrMessagePanel.prototype.showWarning = function(message) {
    this.showMessage('warning', message);
};