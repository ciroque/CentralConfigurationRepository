Central Configuration Repository
================================

## Overview
Central Configuration Repository is REST-ful service that stores application configuration settings in a centralized location.
Each setting is comprised of a composite key, a value, cache expiration, and effective dates. Additionally, support is included
for default values at each segment of the hierarchy.

### Composite Key
Each configuration setting is keyed based on environment, application, scope, and name. These values create a hierarchy
that uniquely identifies a specific configuration value.

### Cache Expiration
The definition of a configuration setting includes a cache lifetime component as well. Clients of the service
should use this value to minimize calls to the service. The cache lifetime is a numeric value can is generally intended
to indicate the number of seconds the value should be cached before subsequent calls to the service are made. However,
these semantics are not enforced within the service and so the value can be interpreted in any manner desirable.

### Effective Dates
It is possible to define a date range during which a given configuration value is valid. Part of a value's definition are
the eff_date and end_date fields. This makes it possible to schedule configuration changes for future dates, and retire existing
values. The service currently maintains the history of changes for each value. This realizes an audit trail of changes.

### Default Values
it is possible to define a default value using the string 'default' (without quotes) at the environment segment of the hierarchy. The service
will automatically return the default value, if it exists, when a query contains a request that cannot be satisfied due to expiration
values, or the non-existence of a value for the specified environment. For example, if a request comes in as follows:

    /setting/nonexistent/webservice/logging/logfilename

and there is no environment named nonexistent defined, but a default environment IS defined and the remaining segments can be resolved,
the configuration value defined as the default will be returned. This provides the ability to designate a fallback configuration value, or support a configuration value that does
 not change across environments without having to define the configuration value in each environment.

### Composition
The service is comprised of several different endpoints that each offer a slice of related functionality.

- Provider Endpoints
 - Configuration Provider Service
 - Batch Configuration Provider Service
- Management Endpoints
 - Configuration Management Service
- Monitoring / Performance Endpoints
 - Access Statistics Provider Service
 - Audit Log Provider Service

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

Obviously, these will be different depending upon the needs of the specific business. The Central Configuration Repository
implementation makes no assumptions as to the architecture of environment, nor does it impose any restrictions on how
environments are used.

This level of hierarchy offers great flexibility in supporting any environment topology.

##### Application
The application segment is generally used to distinguish specific products and / or groups of products that perform / provide
distinctive functionality. As with the environment segment, the Central Configuration Repository imposes no restrictions
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

