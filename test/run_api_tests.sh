#!/bin/bash

PATH=$PATH:../../node_modules/jasmine-node/bin

clear

pushd ./api


writeToConsole() {
    echo
    echo ===== $(date) =====
    echo $1
    echo ================================================================================
}

writeToConsole 'Running tests via jasmine and Frisby...'

jasmine-node .

popd