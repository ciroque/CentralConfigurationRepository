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

frisby_module.create('update valid document')
    .post(settings.service.protocol + '://' +
        settings.service.hostname + ':' +
        settings.service.port + '/ccr/schedule/upd/appd/scope/setting',
    {
        'originalDocument': {
            'key': {
                'environment': 'upd',
                'application': 'appd',
                'scope': 'scope',
                'setting': 'setting'
            },
            'value': 'prdeml001',
            'temporalization': {
                'cache_lifetime': 600,
                'eff_date': '1970-01-01T00:00:00.000Z',
                'end_date': '9999-12-31T08:00:00.000Z'
            }
        },
        'updatedDocument': {
            'key': {
                'environment': 'upd',
                'application': 'appd',
                'scope': 'scope',
                'setting': 'setting'
            },
            'value': 'frisby test - update valid document',
            'temporalization' : {
                'cache_lifetime': '1200',
                'eff_date': '1970-01-01T00:00:00.000Z',
                'end_date': '9999-12-31T08:00:00.000Z'
            }
        }
    },
    {json : true})
    .expectStatus(200)
    //.expectBodyContains('frisby test - update valid document')
    .toss();

frisby_module.create('update document missing key fields')
    .post(settings.service.protocol + '://' +
        settings.service.hostname + ':' +
        settings.service.port + '/ccr/schedule/upd/appd/scope/setting',
    {
        'originalDocument': {
            'key': {
                'environment': 'upd',
                'application': 'appd',
                'scope': 'scope',
                'setting': 'setting'
            },
            'value': 'prdeml001',
            'temporalization': {
                'cache_lifetime': 600,
                'eff_date': '1970-01-01T00:00:00.000Z',
                'end_date': '9999-12-31T08:00:00.000Z'
            }
        },
        'updatedDocument': {
            'key': {
                'environment': 'upd',
                'setting': 'setting'
            },
            'value': 'frisby test - update valid document',
            'temporalization' : {
                'cache_lifetime': '1200',
                'eff_date': '1970-01-01T00:00:00.000Z',
                'end_date': '9999-12-31T08:00:00.000Z'
            }
        }
    },
    {json : true})
    .expectStatus(422)
    //.expectBodyContains('frisby test - update valid document')
    .toss();

frisby_module.create('update document missing date field')
    .post(settings.service.protocol + '://' +
        settings.service.hostname + ':' +
        settings.service.port + '/ccr/schedule/upd/appd/scope/setting',
    {
        'originalDocument': {
            'key': {
                'environment': 'upd',
                'application': 'appd',
                'scope': 'scope',
                'setting': 'setting'
            },
            'value': 'prdeml001',
            'temporalization': {
                'cache_lifetime': 600,
                'eff_date': '1970-01-01T00:00:00.000Z',
                'end_date': '9999-12-31T08:00:00.000Z'
            }
        },
        'updatedDocument': {
            'key': {
                'environment': 'upd',
                'application': 'appd',
                'scope': 'scope',
                'setting': 'setting'
            },
            'value': 'frisby test - update valid document',
            'temporalization' : {
                'cache_lifetime': '1200',
                'end_date': '9999-12-31T08:00:00.000Z'
            }
        }
    },
    {json : true})
    .expectStatus(200)
    //.expectBodyContains('frisby test - update valid document')
    .toss();

frisby_module.create('update document missing date field')
    .post(settings.service.protocol + '://' +
        settings.service.hostname + ':' +
        settings.service.port + '/ccr/schedule/upd/appd/scope/setting',
    {
        'originalDocument': {
            'key': {
                'environment': 'upd',
                'application': 'appd',
                'scope': 'scope',
                'setting': 'setting'
            },
            'value': 'prdeml001',
            'temporalization': {
                'cache_lifetime': 600,
                'eff_date': '1970-01-01T00:00:00.000Z',
                'end_date': '9999-12-31T08:00:00.000Z'
            }
        },
        'updatedDocument': {
            'key': {
                'environment': 'upd',
                'application': 'appd',
                'scope': 'scope',
                'setting': 'setting'
            },
            'value': 'frisby test - update valid document',
            'temporalization' : {
                'cache_lifetime': 'non-numeric',
                'eff_date': '1970-01-01T00:00:00.000Z',
                'end_date': '9999-12-31T08:00:00.000Z'
            }
        }
    },
    {json : true})
    .expectStatus(422)
    //.expectBodyContains('frisby test - update valid document')
    .toss();

frisby_module.create('update document invalid date field')
    .post(settings.service.protocol + '://' +
        settings.service.hostname + ':' +
        settings.service.port + '/ccr/schedule/upd/appd/scope/setting',
    {
        'originalDocument': {
            'key': {
                'environment': 'upd',
                'application': 'appd',
                'scope': 'scope',
                'setting': 'setting'
            },
            'value': 'prdeml001',
            'temporalization': {
                'cache_lifetime': 600,
                'eff_date': '1970-01-01T00:00:00.000Z',
                'end_date': '9999-12-31T08:00:00.000Z'
            }
        },
        'updatedDocument': {
            'key': {
                'environment': 'upd',
                'application': 'appd',
                'scope': 'scope',
                'setting': 'setting'
            },
            'value': 'frisby test - update valid document',
            'temporalization' : {
                'cache_lifetime': 600,
                'eff_date': 'invalid date',
                'end_date': '9999-12-31T08:00:00.000Z'
            }
        }
    },
    {json : true})
    .expectStatus(422)
    //.expectBodyContains('frisby test - update valid document')
    .toss();



