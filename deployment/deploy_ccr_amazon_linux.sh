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
    echo ===== Ensuring prerequisites are installed
    $PACKAGE_MANAGER install -y gcc-c++ make
    $PACKAGE_MANAGER install -y openssl-devel
    $PACKAGE_MANAGER install -y git

    echo
    echo ===== Ensuring nginx and memcached are installed
    $PACKAGE_MANAGER install -y nginx
    $PACKAGE_MANAGER install -y memcached

    service memcached start

    echo
    echo ===== Installing mongodb
    echo "
[10gen]
name=10gen Repository
baseurl=http://downloads-distro.mongodb.org/repo/redhat/os/x86_64
gpgcheck=0" | tee -a /etc/yum.repos.d/10gen.repo

    $PACKAGE_MANAGER -y install mongo-10gen-server
    $PACKAGE_MANAGER -y install sysstat

    mkdir -p $MONGODB_ROOT_PATH/data
    mkdir -p $MONGODB_ROOT_PATH/log
    mkdir -p $MONGODB_ROOT_PATH/journal

    chown mongod:mongod $MONGODB_ROOT_PATH/data
    chown mongod:mongod $MONGODB_ROOT_PATH/log
    chown mongod:mongod $MONGODB_ROOT_PATH/journal

    /etc/init.d/mongod start

    echo
    echo ===== Ensuring Node.js is installed
    $PACKAGE_MANAGER localinstall --nogpgcheck http://nodejs.tchol.org/repocfg/amzn1/nodejs-stable-release.noarch.rpm
    $PACKAGE_MANAGER -y install nodejs-compat-symlinks npm

    echo
    echo ===== Ensuring temporary build path exists
    if [ -d $TMP_BUILD_PATH ]
    then
        rm -R $TMP_BUILD_PATH
    fi
    mkdir -p $TMP_BUILD_PATH
    echo
    echo ===== Ensuring the deployment directory exists
    mkdir -p $INSTALL_PATH

    pushd $INSTALL_PATH > /dev/null

    echo
    echo ===== Downloading sources from github
    if [ -d $INSTALL_PATH/$INSTALL_DIRECTORY ]
    then
        rm -R $INSTALL_PATH/$INSTALL_DIRECTORY
    fi

    git clone "https://github.com/ciroque/CentralConfigurationRepository.git"
    mv ./Shared/SharedConfiguration .
    rm -R ./Shared

    echo
    echo ===== Installing Node module dependencies
    pushd ./$INSTALL_DIRECTORY/source
    npm install -d
    popd

    echo
    echo ===== Installing forever
    npm install -g forever

    echo
    echo ===== Writing configuration files
    echo TODO

    echo
    echo ===== Copying init.d script into place and configuring for automatic startup
    cp $INSTALL_PATH/$INSTALL_DIRECTORY/source/etc_init.d/$STARTUP_SCRIPT_NAME /etc/init.d
    chkconfig --add /etc/init.d/$STARTUP_SCRIPT_NAME

    echo
    echo ===== Importing the initial configuration settings into the datastore
    mongoimport -d scs -c settings --drop --file $INSTALL_PATH/$INSTALL_DIRECTORY/tests/unit/seed_data/initial_seed_data.dat

    echo
    echo ===== Starting all services
    cd $INSTALL_PATH/$INSTALL_DIRECTORY/source
    /etc/init.d/$STARTUP_SCRIPT_NAME start

    echo
    echo ===== Running smoke tests...
    cd $INSTALL_PATH/$INSTALL_DIRECTORY/tests/smoke
    npm install frisby
    ../../source/node_modules/jasmine-node/bin/jasmine-node .

}