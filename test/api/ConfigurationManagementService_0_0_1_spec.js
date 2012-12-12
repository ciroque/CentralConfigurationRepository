/**
 * User: steve
 * Date: 7/23/12
 * Time: 6:47 PM
 */

var frisby_module = require('frisby');

var settings_module = require('n-app-conf');
var settings = new settings_module.Settings('../../lib/service/settings.json');

frisby_module.create('List environments')
    .get(settings.service.protocol + '://' +
        settings.service.hostname + ':' +
        settings.service.port + '/ccr/schedule')
    .expectStatus(200)
    .expectHeaderContains('x-api-version', '0.0.1')
    .expectBodyContains('key')
    .expectBodyContains('environment')
    .toss();

frisby_module.create('List applications')
    .get(settings.service.protocol + '://' +
        settings.service.hostname + ':' +
        settings.service.port + '/ccr/schedule/prod')
    .expectStatus(200)
    .expectHeaderContains('x-api-version', '0.0.1')
    .expectBodyContains('key')
    .expectBodyContains('application')
    .toss();

frisby_module.create('List scopes')
    .get(settings.service.protocol + '://' +
        settings.service.hostname + ':' +
        settings.service.port + '/ccr/schedule/prod/application2')
    .expectStatus(200)
    .expectHeaderContains('x-api-version', '0.0.1')
    .expectBodyContains('key')
    .expectBodyContains('scope')
    .toss();

frisby_module.create('List settings')
    .get(settings.service.protocol + '://' +
        settings.service.hostname + ':' +
        settings.service.port + '/ccr/schedule/prod/application2/scope')
    .expectStatus(200)
    .expectHeaderContains('x-api-version', '0.0.1')
    .expectBodyContains('key')
    .expectBodyContains('setting')
    .toss();

frisby_module.create('Retrieve value')
    .get(settings.service.protocol + '://' +
        settings.service.hostname + ':' +
        settings.service.port + '/ccr/schedule/prod/application2/scope/setting')
    .expectStatus(200)
    .expectHeaderContains('x-api-version', '0.0.1')
    .expectBodyContains('key')
    .expectBodyContains('value')
    .toss();

frisby_module.create('Application not found')
    .get(settings.service.protocol + '://' +
    settings.service.hostname + ':' +
    settings.service.port + '/ccr/schedule/prod/blase')
    .expectStatus(404)
    .expectHeaderContains('x-api-version', '0.0.1')
    .toss();

frisby_module.create('Scope not found')
    .get(settings.service.protocol + '://' +
    settings.service.hostname + ':' +
    settings.service.port + '/ccr/schedule/prod/application2/blase')
    .expectStatus(404)
    .expectHeaderContains('x-api-version', '0.0.1')
    .toss();

frisby_module.create('Setting not found')
    .get(settings.service.protocol + '://' +
    settings.service.hostname + ':' +
    settings.service.port + '/ccr/schedule/prod/application2/scope/blase')
    .expectStatus(404)
    .expectHeaderContains('x-api-version', '0.0.1')
    .toss();
