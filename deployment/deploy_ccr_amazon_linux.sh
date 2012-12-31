#!/bin/bash
    
### ****************************************************************************
##  deploy_ccr_amazon_linux.sh
###
##  Deploys CCR on an AWS instance running Amazon Linux
### ****************************************************************************

INSTALL_PATH=/opt/ciroque
INSTALL_DIRECTORY=CentralConfigurationRepository
TMP_BUILD_PATH=/tmp/ccrbuilds
MONGODB_ROOT_PATH=/srv/mongodb
STARTUP_SCRIPT_NAME=ccr_svc_control

VERBOSE=

PACKAGE_MANAGER=yum

run() {
    clear

    echo
    echo
    echo == ===== ===== ===== ===== Ensuring temporary build path exists
    if [ -d $TMP_BUILD_PATH ]
    then
        rm -R $TMP_BUILD_PATH
    fi
    mkdir -p $TMP_BUILD_PATH

    pushd $TMP_BUILD_PATH

    echo
    echo
    echo == ===== ===== ===== ===== Downloading sources from github
    git clone "https://github.com/ciroque/CentralConfigurationRepository.git"

    echo
    echo
    echo == ===== ===== ===== ===== Ensuring the deployment directory exists
    if [ -d $INSTALL_PATH/$INSTALL_DIRECTORY ]
    then
        rm -R $INSTALL_PATH/$INSTALL_DIRECTORY
    fi
    mkdir -p $INSTALL_PATH

    echo
    echo
    echo == ===== ===== ===== ===== Copy service code into place

    echo
    echo
    echo == ===== ===== ===== ===== Copy management web site code into place

    echo
    echo
    echo == ===== ===== ===== ===== Installing Node module dependencies
    npm install -d
    popd

    echo
    echo
    echo == ===== ===== ===== ===== Installing forever
    npm install -g forever

    echo
    echo == ===== ===== ===== ===== Writing configuration files
    echo TODO

    echo
    echo == ===== ===== ===== ===== Copying init.d script into place and configuring for automatic startup
#    cp $INSTALL_PATH/$INSTALL_DIRECTORY/source/etc_init.d/$STARTUP_SCRIPT_NAME /etc/init.d
#    chkconfig --add /etc/init.d/$STARTUP_SCRIPT_NAME

    echo
    echo == ===== ===== ===== ===== Importing the initial configuration settings into the datastore
    mongoimport -d ccr -c settings --drop --file $INSTALL_PATH/$INSTALL_DIRECTORY/seed_data/initial_settings.dat

    echo
    echo == ===== ===== ===== ===== Starting all services
#    cd $INSTALL_PATH/$INSTALL_DIRECTORY/source
#    /etc/init.d/$STARTUP_SCRIPT_NAME start

    echo
    echo == ===== ===== ===== ===== Running smoke tests...
#    cd $INSTALL_PATH/$INSTALL_DIRECTORY/test
#    npm install frisby
#    ./run_api_tests.sh


#    rm -R $TMP_BUILD_PATH
}

run
