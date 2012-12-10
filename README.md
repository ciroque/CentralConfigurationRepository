CentralConfigurationRepository
==============================

A REST-ful service repository that stores application configuration settings in a centralized location.

##APIs

### Configuration Provider Service

#### Overview
This is the endpoint that should be used to request the settings latest value.

#### Resource Identification URIs
The CMS API is rooted at /setting and has the following hierarchy:

    /:environment - indicates the environment for which the desired settings are being requested.
    /:application - indicates the application for which the desired settings are being requested.
    /:scope - indicates the scope for which the desired settings are being requested.
    /:setting - indicates the name of the configuration setting being requested.

At each segment of the hierarchy the service provides a list of the available values at the subsequent segment.
More information can be found in the Examples section below.

##### Environment
The environment segment is generally used to distinguish the physical group of computers that comprise a certain domain of
released code / functionality. These most often include:

- Development
- Build / Continuous Integration
- Test
- QA
- Production Staging
- Production
- Production Backup / Warm Standby

Obviously, these will be different depending upon the needs of the specific business. The CentralConfigurationRepository
implementation makes no assumptions as to the architecture of environment, nor does it impose any restrictions on how
environments are used.

This level of hierarchy offers great flexibility in supporting any environment topology.

##### Application
The application segment is generally used to distinguish specific products and / or groups of products that perform / provide
distinctive functionality. As with the environment segment, the CentralConfigurationRepository imposes no restrictions
and is totally flexible in regards to how applications are defined and used.

##### Scope
The scope segment is generally used to afford a grouping of logical functionality within an application. An example would be
logging. The various settings related to the logging within an application can be stored in the logging scope. Another
example would be database connection information.

As with the other segments there are no restrictions on how scopes can be defined.

#### Examples

As noted above it is possible to perform discovery by starting at the root hierarchy segment and build the URI to the desired setting.

    The /setting URI will return a list of the environments available.
    The /setting/production URI will return a list of the applications available in the production environment.
    The /setting/production/webservice URI will return a list of the scopes available in the webservice application in the production environment.
    The /setting/production/webservice/logging URI will return a list of the logging settings for the webservice appliction in the production environment.

### Batch Configuration Provider Service

#### Overview

This is the endpoint that should be used to request the full set of configuration settings for an application and,
optionally, scope (all scopes are included if only the application is provided).

#### Resource Identification URIs

#### Examples

### Configuration Management Service

#### Overview
This is the endpoint that should be used to manage the configuration settings.

#### Resource Identification URIs

#### Examples

