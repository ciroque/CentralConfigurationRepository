#!/usr/bin/env node

/**
 * User: steve
 * Date: 6/18/12
 * Time: 12:26 AM
 */

var web_service = require('./WebService');

console.log(web_service);

var shared_configuration_service = new web_service.WebService();

//process.on('uncaughtException', shared_configuration_service.handleUnhandledException);

shared_configuration_service.run();
