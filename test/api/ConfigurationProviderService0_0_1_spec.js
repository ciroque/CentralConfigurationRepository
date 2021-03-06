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
        settings.service.port + '/ccr/setting')
    .expectStatus(200)
    .expectHeaderContains('x-api-version', '0.0.1')
    .expectBodyContains('key')
    .expectBodyContains('environment')
    .toss();

frisby_module.create('Tests that calling the endpoint with an environment returns a list of available applications')
    .get(
        settings.service.protocol + '://' +
        settings.service.hostname + ':' +
        settings.service.port + '/ccr/setting/default')
    .expectStatus(200)
    .expectHeaderContains('x-api-version', '0.0.1')
    .expectBodyContains('key')
    .expectBodyContains('application')
    .toss();

frisby_module.create('Tests that calling the endpoint with an environment and application returns a list of available scopes')
    .get(
        settings.service.protocol + '://' +
        settings.service.hostname + ':' +
        settings.service.port + '/ccr/setting/default/application2')
    .expectStatus(200)
    .expectHeaderContains('x-api-version', '0.0.1')
    .expectBodyContains('key')
    .expectBodyContains('scope')
    .toss();

frisby_module.create('Tests that calling the endpoint with an environment, application, and scope returns a list of available settings')
    .get(
        settings.service.protocol + '://' +
        settings.service.hostname + ':' +
        settings.service.port + '/ccr/setting/default/application2/scope')
    .expectStatus(200)
    .expectHeaderContains('x-api-version', '0.0.1')
    .expectBodyContains('key')
    .expectBodyContains('setting')
    .toss();

frisby_module.create('Tests that calling the endpoint with an environment, application, scope, and setting returns the setting')
    .get(
        settings.service.protocol + '://' +
        settings.service.hostname + ':' +
        settings.service.port + '/ccr/setting/default/application2/scope/setting')
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

frisby_module.create('The specified environment is returned when a default environment exists')
    .get(
        settings.service.protocol + '://' +
        settings.service.hostname + ':' +
        settings.service.port + '/ccr/setting/prod/application2/scope/setting')
    .expectStatus(200)
    .expectHeaderContains('x-api-version', '0.0.1')
    .expectBodyContains('key')
    .expectBodyContains('environment')
    .expectBodyContains('prod')
    .expectBodyContains('application2')
    .expectBodyContains('scope')
    .expectBodyContains('setting')
    .expectBodyContains('prod_setting')
    .expectBodyContains('temporalization')
    .expectBodyContains('eff_date')
    .expectBodyContains('end_date')
    .expectBodyContains('cache_lifetime')
    .toss();

frisby_module.create('Default environment is returned when requested environment does not exist')
    .get(
        settings.service.protocol + '://' +
        settings.service.hostname + ':' +
        settings.service.port + '/ccr/setting/prod/application4/scope/setting')
    .expectStatus(200)
    .expectHeaderContains('x-api-version', '0.0.1')
    .expectBodyContains('key')
    .expectBodyContains('environment')
    .expectBodyContains('default')
    .expectBodyContains('application4')
    .expectBodyContains('scope')
    .expectBodyContains('setting')
    .expectBodyContains('default_setting')
    .expectBodyContains('temporalization')
    .expectBodyContains('eff_date')
    .expectBodyContains('end_date')
    .expectBodyContains('cache_lifetime')
    .toss();

frisby_module.create('Application not found')
    .get(settings.service.protocol + '://' +
    settings.service.hostname + ':' +
    settings.service.port + '/ccr/setting/prod/blase')
    .expectStatus(404)
    .expectHeaderContains('x-api-version', '0.0.1')
    .toss();

frisby_module.create('Scope not found')
    .get(settings.service.protocol + '://' +
    settings.service.hostname + ':' +
    settings.service.port + '/ccr/setting/prod/application2/blase')
    .expectStatus(404)
    .expectHeaderContains('x-api-version', '0.0.1')
    .toss();

frisby_module.create('Setting not found')
    .get(settings.service.protocol + '://' +
    settings.service.hostname + ':' +
    settings.service.port + '/ccr/setting/prod/application2/scope/blase')
    .expectStatus(404)
    .expectHeaderContains('x-api-version', '0.0.1')
    .toss();
