#!/bin/bash

clear

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

writeToConsole 'Preparing datastore with test documents...'

writeToConsole 'Running tests via nodeunit...'

nodeunit .

popd