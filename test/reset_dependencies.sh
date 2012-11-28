#!/bin/sh

writeToConsole() {
    echo
    echo ===== $(date) =====
    echo $1
    echo ================================================================================
}

writeToConsole 'Removing all dependencies...'
npm ls | grep -v 'npm@' | awk '/@/ {print $2}' | awk -F@ '{print $1}' | xargs npm rm

writeToConsole 'Ensuring dependent packages are installed...'
npm install -d
