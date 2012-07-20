/**
 * User: steve
 * Date: 7/20/12
 * Time: 10:55 AM
 */

var frisby_module = require('frisby');
var settings_module = require('n-app-conf');
var settings = new settings_module.Settings('../../lib/service/settings.json');

frisby_module.create('Tests that calling the root endpoint returns a list of available environments')
    .get(
        settings.service.protocol + '://' +
        settings.service.hostname + ':' +
        settings.service.port + '/setting')
    .expectStatus(200)
    .expectHeaderContains('x-api-version', '0.0.1')
    .expectBodyContains('key')
    .expectBodyContains('environment')
    .toss();

frisby_module.create('Tests that calling the endpoint with an environment returns a list of available applications')
    .get(
        settings.service.protocol + '://' +
        settings.service.hostname + ':' +
        settings.service.port + '/setting/default')
    .expectStatus(200)
    .expectHeaderContains('x-api-version', '0.0.1')
    .expectBodyContains('key')
    .expectBodyContains('application')
    .toss();

frisby_module.create('Tests that calling the endpoint with an environment and application returns a list of available scopes')
    .get(
        settings.service.protocol + '://' +
        settings.service.hostname + ':' +
        settings.service.port + '/setting/default/default')
    .expectStatus(200)
    .expectHeaderContains('x-api-version', '0.0.1')
    .expectBodyContains('key')
    .expectBodyContains('scope')
    .toss();

frisby_module.create('Tests that calling the endpoint with an environment, application, and scope returns a list of available settings')
    .get(
        settings.service.protocol + '://' +
        settings.service.hostname + ':' +
        settings.service.port + '/setting/default/default/default')
    .expectStatus(200)
    .expectHeaderContains('x-api-version', '0.0.1')
    .expectBodyContains('key')
    .expectBodyContains('setting')
    .toss();

frisby_module.create('Tests that calling the endpoint with an environment, application, scope, and setting returns the setting')
    .get(
        settings.service.protocol + '://' +
        settings.service.hostname + ':' +
        settings.service.port + '/setting/default/default/default/default')
    .expectStatus(200)
    .expectHeaderContains('x-api-version', '0.0.1')
    .expectBodyContains('key')
    .expectBodyContains('environment')
    .expectBodyContains('application')
    .expectBodyContains('scope')
    .expectBodyContains('setting')
    .expectBodyContains('value')
    .expectBodyContains('temporalization')
    .expectBodyContains('eff_date')
    .expectBodyContains('end_date')
    .expectBodyContains('cache_lifetime')
    .toss();