/**
 * User: steve
 * Date: 7/6/12
 * Time: 4:27 PM
 */

function _createDatastore(settings, log_writer) {
    return { settings : settings, log_writer : log_writer };
}

module.exports = {
    createDatastore : _createDatastore
};