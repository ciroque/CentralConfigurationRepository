CentralConfigurationRepository
==============================

A REST-ful service repository that stores application configuration settings in a centralized location.

##APIs

### Configuration Provider Service
This is the endpoint that should be used to request the settings latest value.

### Batch Configuration Provider Service
This is the endpoint that should be used to request the full set of configuration settings for an application and,
optionally, scope (all scopes are included if only the application is provided).

### Configuration Management Service
This is the endpoint that should be used to manage the configuration settings.
