#!/bin/bash
    
### ****************************************************************************
##  deploy_ccr_amazon_linux.sh
###
##  Deploys CCR on an AWS instance running Amazon Linux
### ****************************************************************************

DIR_NAME=CentralConfigurationRepository
INSTALL_PATH=/opt/ciroque/$DIR_NAME
SVC_INSTALL_PATH=$INSTALL_PATH/service
WEB_INSTALL_PATH=$INSTALL_PATH/web

NGINX_DIRECTORY=/etc/nginx/
NGINX_SITES_AVAILABLE_DIR=$NGINX_DIRECTORY/sites-available
NGINX_SITES_ENABLED_DIR=$NGINX_DIRECTORY/sites-enabled
NGINX_CONF_FILENAME=$NGINX_SITES_AVAILABLE_DIR/$DIR_NAME.conf

TMP_BUILD_PATH=/tmp/ccrbuilds
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
        rm -R $TMP_BUILD_PATH > /dev/nul
    fi
    mkdir -p $TMP_BUILD_PATH

    pushd $TMP_BUILD_PATH > /dev/nul

    echo
    echo == ===== ===== ===== ===== Downloading sources from github
    git clone "https://github.com/ciroque/CentralConfigurationRepository.git"

    ### service installation

    echo
    echo == ===== ===== ===== ===== Ensuring the service deployment directory exists
    if [ -d $SVC_INSTALL_PATH ]
    then
        rm -R $SVC_INSTALL_PATH
    fi
    mkdir -p $SVC_INSTALL_PATH

    echo
    echo == ===== ===== ===== ===== Copy service code into place
    pushd ./$DIR_NAME > /dev/nul
    pushd ./lib/service > /dev/nul
    cp -R . $SVC_INSTALL_PATH
    popd > /dev/nul
    cp ./package.json $SVC_INSTALL_PATH
    cp ./README.md $SVC_INSTALL_PATH
    popd > /dev/nul

    echo
    echo == ===== ===== ===== ===== Installing Node module dependencies
    pushd $SVC_INSTALL_PATH > /dev/nul
    npm install -d -q
    popd > /dev/nul

    ### Web site installation

    echo
    echo == ===== ===== ===== ===== Ensuring the website deployment directory exists
    if [ -d $WEB_INSTALL_PATH ]
    then
        rm -R $WEB_INSTALL_PATH
    fi
    mkdir -p $WEB_INSTALL_PATH

    echo
    echo == ===== ===== ===== ===== Copy web site code into place
    pushd ./$DIR_NAME/lib/web > /dev/nul
    cp -R . $WEB_INSTALL_PATH
    popd > /dev/nul

    echo
    echo == ===== ===== ===== ===== Copying nginx configuration files into place
    if [ ! -d $NGINX_SITES_AVAILABLE_DIR ]
    then
        mkdir $NGINX_SITES_AVAILABLE_DIR
    fi

    if [ ! -d $NGINX_SITES_ENABLED_DIR ]
    then
        mkdir $NGINX_SITES_ENABLED_DIR
    fi

    if [ -f $NGINX_CONF_FILENAME ]
    then
        rm $NGINX_CONF_FILENAME
    fi

    pushd $DIR_NAME/deployment
    cp ccr_nginx.conf $NGINX_CONF_FILENAME


    ### install runnables

    echo
    echo
    echo == ===== ===== ===== ===== Installing forever
    npm install -g forever -q

    echo
    echo == ===== ===== ===== ===== Copying init.d script into place and configuring for automatic startup
    pushd ./$DIR_NAME/deployment/init.d
    cp $STARTUP_SCRIPT_NAME /etc/init.d
    chmod +x /etc/init.d/$STARTUP_SCRIPT_NAME
    chkconfig --add /etc/init.d/$STARTUP_SCRIPT_NAME
    popd

#    echo
#    echo == ===== ===== ===== ===== Importing the initial configuration settings into the datastore
#    mongoimport -d ccr -c settings --drop --file $SVC_INSTALL_PATH/seed_data/initial_settings.dat

    echo
    echo == ===== ===== ===== ===== Starting all services
    pushd $SVC_INSTALL_PATH
    /etc/init.d/$STARTUP_SCRIPT_NAME start
    popd

    echo
    echo == ===== ===== ===== ===== Running smoke tests...
#    cd $SVC_INSTALL_PATH/test
#    npm install frisby
#    ./run_api_tests.sh


#    rm -R $TMP_BUILD_PATH
}

run
