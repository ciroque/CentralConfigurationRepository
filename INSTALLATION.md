# Prerequisites

## [nginx](http://www.nginx.org/)
Used to host the management web site. [Apache](http://httpd.apache.org/) is also an option.

## [memcached](http://memcached.org/) used for access statistics.

## [MongoDB](http://www.mongodb.org) main datastore

## [Node.js](nodejs.org) service runtime

## [Node Package Manager - npm](https://npmjs.org/) package manager for installing packages used by CentralConfigurationRepository.

# Installation script

## Amazon Linux

wget https://raw.github.com/ciroque/CentralConfigurationRepository/master/deployment/deploy_ccr_amazon_linux.sh

sudo chmod +x deploy_ccr_amazon_linux.sh

sudo ./deploy_ccr_amazon_linux.sh