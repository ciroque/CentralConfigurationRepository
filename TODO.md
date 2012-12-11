# BulkConfigurationProviderService
1. Accept hierarchy environment / application to environment / application / scope
1. return all settings for the request
1. use settings as the base URI => /settings/:environment/:application/:scope

# General Code Cleanup
1. Parameterize CcrList so it does not use jQuery select statements directly. (provide select or options object in ctor).
1. Unit tests around CcrList.
1. Unit Tests around CcrServiceClient

# Testing
1. jMeter tests for performance.

# Clients
1. .Net client