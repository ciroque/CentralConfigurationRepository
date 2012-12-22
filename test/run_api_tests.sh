#!/bin/bash

clear

PATH=$PATH:../../node_modules/jasmine-node/bin

DIR="$( cd "$( dirname "$0" )" && pwd )"

pushd ./api

writeToConsole() {
    echo
    echo ===== $(date) =====
    echo $1
    echo ================================================================================
}

writeToConsole 'Setting environment variable overrides.'
export datastore__database_name=ccr_tests
export service__port=33131
export datastore__database_name=ccr_tests
export logging__log_level=8

writeToConsole 'Starting CCR for tests.'
pushd ../../lib/service
forever start -l ./ccr_tests.log --append ./run_central_configuration_repository_service.js
forever list
popd

writeToConsole 'Preparing data store with test documents...'
mongoimport -d ccr_tests -c settings --drop --file ../unit/assets/test_settings.dat

writeToConsole 'Running tests via jasmine and Frisby...'
jasmine-node .

writeToConsole 'Stopping CCR...'
forever stop 0

popd

export datastore__database_name=
export service__port=
export datastore__database_name=
