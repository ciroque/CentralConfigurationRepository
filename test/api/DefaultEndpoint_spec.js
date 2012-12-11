/**
 * User: steve
 * Date: 7/9/12
 * Time: 8:07 PM
 */

var frisby_module = require('frisby');

var settings_module = require('n-app-conf');

var settings = new settings_module.Settings('../../lib/service/settings.json');

frisby_module.create('Default endpoint HEAD')
    .head(
        settings.service.protocol + '://' +
        settings.service.hostname + ':' +
        settings.service.port + '/')
    .expectStatus(200)
    .expectHeaderContains('x-rest-ack', 'ACK')
    .toss();

frisby_module.create('Default endpoing GET')
    .get(
        settings.service.protocol + '://' +
            settings.service.hostname + ':' +
            settings.service.port + '/')
    .expectStatus(200)
    .expectHeaderContains('x-rest-ack', 'ACK')
    .expectBodyContains('ping')
    .toss();
