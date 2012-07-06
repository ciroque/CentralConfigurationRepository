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

    this.datastore = {};
    node_extend(true, this.datastore, nconf_module.get('datastore'));

    this.service = {};
    node_extend(true, this.service, nconf_module.get('service'));

    this.logging = {};
    node_extend(true, this.logging, nconf_module.get('logging'));
}

module.exports = { Settings : Settings };

