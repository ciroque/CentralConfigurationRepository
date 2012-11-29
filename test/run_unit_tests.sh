#!/bin/bash

clear

export logging__log_level=7

if [[ ("$#" == 1 && $1 =~ ^[0-9] ) ]]; then
    export CCR_LOG_WRITER_LOG_LEVEL=$1
fi

pushd ./unit

writeToConsole() {
    echo
    echo ===== $(date) =====
    echo $1
    echo ================================================================================
}

writeToConsole 'Preparing data store with test documents...'
mongoimport -d ccr_tests -c settings --drop --file ./assets/test_settings.dat

writeToConsole 'Running tests via nodeunit...'
nodeunit .

popd