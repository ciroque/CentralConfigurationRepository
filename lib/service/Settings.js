/**
 * User: steve
 * Date: 7/5/12
 * Time: 3:01 PM
 */

var nconf_module = require('nconf');
var node_extend = require('node.extend');

function Settings() {

    nconf_module.env();

    var settings_filename = (arguments.length > 0 && typeof(arguments[0]) == 'string') ? arguments[0] : './settings.json';
    nconf_module.file(settings_filename);

    this.access_statistics = {};
    node_extend(true, this.access_statistics, nconf_module.get('access_statistics'));

    this.datastore = {};
    node_extend(true, this.datastore, nconf_module.get('datastore'));

    this.logging = {};
    node_extend(true, this.logging, nconf_module.get('logging'));

    this.service = {};
    node_extend(true, this.service, nconf_module.get('service'));
}

module.exports = {
    Settings : Settings
};

