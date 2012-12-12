#!/usr/bin/env node

/**
 * Created with IntelliJ IDEA.
 * User: steven.wagner
 * Date: 12/12/12
 * Time: 9:11 AM
 * To change this template use File | Settings | File Templates.
 */

var environments = ['dev', 'ci', 'qa', 'qa2', 'accept', 'prod-stage', 'prod', 'ha'];
var applications = ['websvc1', 'websvc2', 'admin web', 'test tool', 'account manager', 'warehouse manager', 'SMARTSWeb', 'LYCARS'];
var scopesAndSettings = [
    { 'logging' : ['logFileame', 'logLevel'] },
    { 'connectionStrings' : ['account', 'audit', 'warehouse'] },
    { 'email' : ['serverName', 'sendAccount', 'recipientList'] }
];

var values = [
    [
        ['logfile1.log', 'log.dat', 'commmon.log'],
        [1, 2, 3, 4]
    ],
    [
        ['servername=db01', 'servername=db02'],
        ['servername=db03', 'servername=thedatabase'],
        ['servername=dw01', 'servername=dw02']
    ],
    [
        ['email01', 'prdeml001', 'mail.company.com'],
        ['report.source@company.com', 'audit@company.com'],
        ['interested.parties@company.com', 'mgmnt@company.com']
    ]
];

var envLen = environments.length;
var appLen = applications.length;
var scoLen = scopesAndSettings.length;

var records = [];

for(var ei = 0; ei < envLen; ei++) {
    for(var ai = 0; ai < appLen; ai++) {
        for(var si = 0; si < scoLen; si++) {
            var scope = scopesAndSettings[si];
            var key = Object.keys(scope)[0];
            var setLen = scope[key].length;
            for(var xi = 0; xi < setLen; xi++) {
                var vals = values[si][xi];
                var valLen = vals.length - 1;
                records.push(
                    {
                        'key' : {
                            'environment' : environments[ei],
                            'application' : applications[ai],
                            'scope' : key,
                            'setting' : scope[key][xi]
                        },
                        'value' : vals[Math.floor((Math.random() * valLen) + 1)],
                        'temporalization': {
                            'cache_lifetime': 600,
                            'eff_date': { '$date': 0 },
                            'end_date': { '$date': 253402243200000 }
                        }
                    }
                );
            }
        }
    }
}

var recLen = records.length;

for(var ri = 0; ri < recLen; ri++) {
    console.log(JSON.stringify(records[ri]));
}

