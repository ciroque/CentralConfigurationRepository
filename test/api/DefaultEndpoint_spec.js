/**
 * User: steve
 * Date: 7/9/12
 * Time: 8:07 PM
 */

var frisby_module = require('frisby');

var settings_module = require('../../lib/service/Settings');

var settings = new settings_module.Settings('../../lib/service/settings.json');

frisby_module.create('...description...')
    .head(
        settings.service.protocol + '://' +
        settings.service.hostname + ':' +
        settings.service.port + '/')
    .expectStatus(200)
    .expectHeaderContains('x-rest-ack', 'ACK')
    .toss();