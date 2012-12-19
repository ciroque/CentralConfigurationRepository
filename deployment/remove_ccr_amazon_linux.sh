#!/bin/bash

PACKAGE_MANAGER=yum
INSTALL_PATH=/opt/ciroque/CentralConfigurationRepository

sudo $PACKAGE_MANAGER remove -y gcc-c++ make
sudo $PACKAGE_MANAGER remove -y openssl-devel
sudo $PACKAGE_MANAGER remove -y git
sudo $PACKAGE_MANAGER remove -y nginx
sudo $PACKAGE_MANAGER remove -y memcached
sudo $PACKAGE_MANAGER -y remove mongo-10gen-server
sudo $PACKAGE_MANAGER -y remove sysstat
sudo $PACKAGE_MANAGER -y remove nodejs-compat-symlinks npm

sudo rm -R $INSTALL_PATH