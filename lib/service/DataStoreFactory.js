/**
 * User: steve
 * Date: 7/6/12
 * Time: 4:27 PM
 */

function _createDataStore(settings, log_writer) {
    var datastore_module = require('./DataStore');
    return new datastore_module.DataStore(settings, log_writer);
}

module.exports = {
    createDataStore : _createDataStore
};