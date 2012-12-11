/**
 * Created with IntelliJ IDEA.
 * User: steve
 * Date: 12/5/12
 * Time: 8:46 PM
 * To change this template use File | Settings | File Templates.
 */

$(document).ready(
    function() {
        jQuery.support.cors = true;

        new CcrList('_envList').clear();
    }
);

function CcrList(listId) {
    this.clear = function() {
        var options = $(listId).prop('options');
        alert(options);
    }
}