/*
    Datastore.js

    Responsible for all interaction with the MongoDB server.    
*/

var async = require('async');
var mongodb = require('mongodb');

// easy access to MongoDB objects
var MongoServer = mongodb.Server;
var MongoDatabase = mongodb.Db;
var ObjectId = mongodb.ObjectID;

// global constants
var SETTINGS_DOC_KEY_ENVIRONMENT = 'key.environment';
var SETTINGS_DOC_KEY_APPLICATION = 'key.application';
var SETTINGS_DOC_KEY_SCOPE = 'key.scope';
var SETTINGS_DOC_KEY_SETTING = 'key.setting';
var SETTINGS_DOC_TEMPORALIZATION_EFF_DATE = 'temporalization.eff_date';
var SETTINGS_DOC_TEMPORALIZATION_END_DATE = 'temporalization.end_date';

var DEFAULT_ENV = 'default';

var mongo_settings = null;

/*
*/
var Datastore = function(settings, log_writer) {
    mongo_settings = settings;

    function analyzeParameters(env, app, scope, setting) {
        if(env == null && app == null && scope == null && setting == null) {
            return {
                distinct : 'key.environment',
                fields : { 'key.environment' : 1 }
            };
        }
        
        if(env != null && app == null && scope == null && setting == null) {
            return {
                distinct : 'key.application',
                fields : { 'key.application' : 1 }
            };
        }
        
        if(env != null && app != null && scope == null && setting == null) {
            return {
                distinct : 'key.scope',
                fields : { 'key.scope' : 1 }
            };
        }
    
        if(env != null && app != null && scope != null && setting == null) {
            return {
                distinct : 'key.setting',
                fields : { 'key.setting' : 1 }
            };
        }
    
        if(env != null && app != null && scope != null && setting != null) {
            return {
                distinct : null,
                fields : {
                    'value' : 1,
                    'key.environment' : 1,
                    'key.application' : 1,
                    'key.scope' : 1,
                    'key.setting' : 1,
                    'temporalization.cache_lifetime' : 1,
                    'temporalization.eff_date' : 1,
                    'temporalization.end_date' : 1
                }
            };
        }
    
        return {};
    }

    function buildAuditDocument(document) {
        return {
            audit_date : new Date(new Date().toUTCString()),
            key : {
                environment : document.key.environment,
                application : document.key.application,
                scope : document.key.scope,
                setting : document.key.setting
            },
            new_values : {
                value : document.value,
                cache_lifetime : document.temporalization.cache_lifetime,
                eff_date : document.temporalization.eff_date,
                end_date : document.temporalization.end_date
            },
            prev_values : {
                value : document.original.value,
                cache_lifetime : document.original.cache_lifetime,
                eff_date : document.original.eff_date,
                end_date : document.original.end_date
            }
        };
    }

    function buildFindParameters(env, app, scope, setting, build_fx) {
        var parameterAnalysisResult = analyzeParameters(env, app, scope, setting);

        build_fx = build_fx ? build_fx : buildQueryWithDateRestriction;

        var query = build_fx(env, app, scope, setting);
        return {
            'query' : query,
            'fields' : parameterAnalysisResult.fields,
            'distinct' : parameterAnalysisResult.distinct };
    }
    
    function buildMongoDbInstance() {
        var server = new MongoServer(
                        mongo_settings.hostname,
                        mongo_settings.port,
                        {});
        
        return new MongoDatabase(
                        mongo_settings.database_name,
                        server);
    }

    function buildQuery(env, app, scope, setting) {
        var query = {};

        if(env != null) {
            query[SETTINGS_DOC_KEY_ENVIRONMENT] = env;
        }

        if(app != null) {
            query[SETTINGS_DOC_KEY_APPLICATION] = app;
        }

        if(scope != null) {
            query[SETTINGS_DOC_KEY_SCOPE] = scope;
        }

        if(setting != null) {
            query[SETTINGS_DOC_KEY_SETTING] = setting;
        }

        return query;
    }
    
    function buildQueryWithDateRestriction(env, app, scope, setting) {
        var query = buildQuery(env, app, scope, setting);
        var current_date = new Date();
        query[SETTINGS_DOC_TEMPORALIZATION_EFF_DATE] = { $lte : current_date };
        query[SETTINGS_DOC_TEMPORALIZATION_END_DATE] = { $gte : current_date };
        
        return query;    
    }
    
    function environmentIsNotDefault(env) {
        return env != null && env != "" && env != DEFAULT_ENV;
    }

    function executeAuditLogQuery(db, query_doc, max_record_count, handler) {
        db.collection(
            mongo_settings.audit_collection_name,
            function(err, collection) {
                if(err != null) {
                    log_writer.writeError(err);
                    handler(err, null);
                } else {
                    log_writer.writeDebug('(&MongoDatastore::executeAuditLogQuery&)::max_record_count => ' + max_record_count + '\nquery_doc => ' + JSON.stringify(query_doc));
                    collection
                        .find(query_doc)
                        .sort({ audit_date : -1 })
                        .limit(parseInt(max_record_count))
                        .toArray(
                        function(err, records) {
                            if(err != null) {
                                log_writer.writeError(err);
                                handler(err, null);
                            } else {
                                handler(null, records);
                            }
                        }
                    );
                }
            }
        );
    }

    function findSettingsInCollection(collection, find_parameters, handler) {

        log_writer.writeDebug('(&MongoDatastore::findSettingsInCollection&)find_parameters::' + JSON.stringify(find_parameters));

        if(find_parameters.distinct != null) {
            log_writer.writeDebug('(&MongoDatastore::findSettingsInCollection&) choosing the useDistinct path...');
            useDistinct(
                collection,
                find_parameters,
                function(err, cursor) {
                    log_writer.writeDebug('(&MongoDatastore::findSettingsInCollection&)[useDistinct]::' + JSON.stringify(cursor));

                    if(err != null) {
                        handler(err, null);
                    } else {
                        var results = [];

                        cursor.forEach(
                            function(item) {
                                var splits = find_parameters.distinct.split('.');
                                var entry = {};
                                entry[splits[0]] = {};
                                entry[splits[0]][splits[1]] = item;

                                results.push(entry);
                            }
                        );

                        handler(null, results);
                    }
                }

            );

        } else {
            log_writer.writeDebug('(&MongoDatastore::findSettingsInCollection&) - choosing the useFind path...');
            useFind(
                collection,
                find_parameters,
                function(err, cursor) {
                    if(err != null) {
                        handler(err, null);
                    } else {
                        cursor.count
                            (
                                // The requirements for this service state that
                                // the requested environment should be honored
                                // if it exists, but should fall back to the 'default'
                                // environment if it does not exist.
                                // While this tack is decidedly different from using
                                // an $or construct in the query and then including
                                // logic to work out which record to send, it works
                                // well...
                                function(err, count) {
                                    var is_not_default_env = environmentIsNotDefault(find_parameters.query[SETTINGS_DOC_KEY_ENVIRONMENT]);
                                    log_writer.writeDebug('>== count(' + count + ') && is_not_default_env(' + is_not_default_env + ')');
                                    if(
                                        is_not_default_env
                                            && count == 0
                                        ) {
                                        log_writer.writeDebug('>== CALLING BACK FOR THE DEFAULT ENVIRONMENT SETTING');
                                        find_parameters.query[SETTINGS_DOC_KEY_ENVIRONMENT] = DEFAULT_ENV;
                                        findSettingsInCollection(collection, find_parameters, handler);

                                    } else {
                                        cursor.toArray(
                                            function(err, docs) {
                                                if(err != null) {
                                                    handler(err, null);
                                                } else {
                                                    handler(null, docs);
                                                }
                                            }
                                        );
                                    }
                                }
                            );
                    }
                }
            );
        }
    }

    function insertSettingSchedule(collection, setting, handler) {
        log_writer.writeDebug('(&MongoDatastore::insertSettingSchedule&)' + JSON.stringify(setting));

        collection.insert(
            setting,
            { safe : true },
            handler
        );
    }

    function openDatabaseAndExecuteQueryDocAgainstAuditCollection(
        query_doc,
        max_record_count,
        handler
        ) {
        var database = buildMongoDbInstance();
        log_writer.writeDebug('(&MongoDatastore::openDatabaseAndExecuteQueryDocAgainstAuditCollection&)::max_record_count => ' + max_record_count + '\nquery_doc => ' + JSON.stringify(query_doc));
        database.open(
            function(err, db) {
                if(err != null) {
                    log_writer.writeError(err);
                    handler(err, null);
                } else {
                    executeAuditLogQuery(db, query_doc, max_record_count, handler);
                }
            }
        );
    }

    function writeAuditRecord(document, handler) {

        var database = buildMongoDbInstance();

        database.open(
            function(err, db) {
                if(err != null) {
                    log_writer.writeError(err);
                } else {
                    db.collection(
                        mongo_settings.audit_collection_name,
                        function(err, collection) {
                            if(err != null) {
                                log_writer.writeError(err);
                            } else {
                                var audit_document = buildAuditDocument(document);

                                log_writer.writeDebug('(&MongoDatastore::writeAuditRecord&) audit_document => ' + JSON.stringify(audit_document));

                                collection.insert(
                                    audit_document,
                                    { safe : true },
                                    function(err, documents) {
                                        if(err != null) {
                                            log_writer.writeError(err);
                                        } else {
                                            log_writer.writeDebug('(&MongoDatastore::writeAuditRecord&) COLLECTION INSERT SUCCESS documents => ' + JSON.stringify(documents));
                                        }

                                        handler(err, documents);
                                    }
                                );
                            }
                        }
                    );
                }
            }
        );
    }

    function updateSettingSchedule(collection, setting, handler) {
        log_writer.writeDebug('(&MongoDatastore::updateSettingSchedule&)' + JSON.stringify(setting));

        var update_doc = {
            '$set' : {
                value : setting.value,
                'temporalization.cache_lifetime' : setting.temporalization.cache_lifetime,
                'temporalization.eff_date' : new Date(new Date(setting.temporalization.eff_date).toUTCString()),
                'temporalization.end_date' : new Date(new Date(setting.temporalization.end_date).toUTCString())
            }
        };

        log_writer.writeDebug('(&MongoDatastore::updateSettingSchedule&) update_doc => ' + JSON.stringify(update_doc));

        collection.findAndModify(
            { _id : new ObjectId('' + setting._id) },
            [['_id','asc']],
            update_doc,
            { new : true },
            handler
        );
    }

    function useFind(collection, params, handler) {
        collection.find(
            params.query,
            params.fields,
            handler
        );
    }
    
    function useDistinct(collection, params, handler) {
        collection.distinct(
            params.distinct,
            params.query,
            handler
        )
    }

    this.queryAuditLogs = function(query_values, handler) {
        log_writer.writeDebug('(&MongoDatastore::queryAuditLogs&)::query_parameters => ' + JSON.stringify(query_values));
        var query_doc = {};
        if(query_values.start_date != null && query_values.end_date == null) {
            // var calculated_dates = calculateStartAndEndCriteriaForDate(query_values.start_date);
            query_doc = { 'audit_date'  : { '$gte' : new Date(new Date(query_values.start_date).toUTCString()) } };
            
        } else if(query_values.start_date != null && query_values.end_date != null) {
            query_doc = {
                'audit_date' : {
                    '$gte' : new Date(new Date(query_values.start_date).toUTCString()),
                    '$lte' : new Date(new Date(query_values.end_date).toUTCString()) } };

        } else if(query_values.start_date == null && query_values.end_date != null) {
            query_doc = { 'audit_date'  : { '$lte' : new Date(new Date(query_values.end_date).toUTCString()) } };
        }

        var max_record_count = (query_values.max_record_count == undefined || query_values.max_record_count == null) ? 0 : query_values.max_record_count;
        log_writer.writeDebug('(&MongoDatastore::queryAuditLogs&)::max_record_count => ' + max_record_count + '\nquery_doc => ' + JSON.stringify(query_doc));
        openDatabaseAndExecuteQueryDocAgainstAuditCollection(query_doc, max_record_count, handler);
    };
    
    this.queryAuditLogsForSetting = function(env, app, scope, setting, handler) {
        var query_doc = {
            'key.environment' : env,
            'key.application' : app,
            'key.scope' : scope,
            'key.setting' : setting
        };
        
        openDatabaseAndExecuteQueryDocAgainstAuditCollection(query_doc, 0, handler);
    };

    this.queryCurrentSetting = function(env, app, scope, setting, handler) {
        var find_parameters = buildFindParameters(env, app, scope, setting);
        this.querySettings(find_parameters, handler);
    };

    this.querySettingSchedule = function(env, app, scope, setting, handler) {
        var find_parameters = buildFindParameters(env, app, scope, setting, buildQuery);
        this.querySettings(find_parameters, handler);
    };

    this.querySettings = function(find_parameters, handler) {
        var database = buildMongoDbInstance();
        database.open(
            function(err, db) {
                if(err != null){
                    handler(err, null);
                } else {
                    db.collection(
                        mongo_settings.settings_collection_name,
                        function(err, collection) {
                            if(err != null) {
                                handler(err, null);
                            } else {
                                findSettingsInCollection(collection, find_parameters, handler)
                            }
                        }
                    );
                }
            }
        )
    };
    
    this.retrieveDistinctSettingKeys = function(handler) {
        var mongo_db = buildMongoDbInstance();
        
        mongo_db.open(
            function(err, db) {
                if(err != null) {
                    handler(err, null);
                } else {
                    db.collection(
                        mongo_settings.settings_collection_name,
                        function(err, collection) {
                            if(err != null) {
                                handler(err, null);
                            } else {
                                collection.distinct(
                                    'key',
                                    function(err, cursor) {
                                        if(err != null) {
                                            handler(err, null);
                                        } else {
                                            handler(null, cursor);
                                        }
                                    }
                                );
                            }
                        }
                    );
                }
            }
        );
    };
    
    this.updateSetting = function(documents, handler) {
        var insert_count = 0;
        var update_count = 0;
        var save_err = null;
        var saved_settings = null;

        var database = buildMongoDbInstance();
        database.open(
            function(err, db) {
                if(err != null) {
                    log_writer.writeError(err);
                    handler(err, null);
                } else {

                    log_writer.writeError('(&MongoDatastore::updateSetting&)[database.map]\tdocuments => ' + JSON.stringify(documents));


                    db.collection(
                        mongo_settings.settings_collection_name,
                        function(err, collection) {

                            async.map(
                                documents,
                                function(document, continuation) {



                                    if(document._id == null) {

                                        log_writer.writeError('(&MongoDatastore::updateSetting&)[async.map]\tinserting');
                                        insertSettingSchedule(collection, document, continuation);
                                        insert_count++;

                                    } else if(document.original != null) {
                                            log_writer.writeError('(&MongoDatastore::updateSetting&)[async.map]\tupdating');
                                            updateSettingSchedule(collection, document, continuation);
                                            update_count++;

                                    } else {

                                        continuation(null, document);
                                    }
                                },
                                function(err, saved) {
                                    log_writer.writeError('(&MongoDatastore::updateSetting&)[async.map(save)]\tcompletion');
                                    save_err = err;
                                    saved_settings = saved;
                                }
                            );
                        }
                    );
                }
            }
        );

        async.map(
            documents,
            function(document, continuation) {
                log_writer.writeError('(&MongoDatastore::updateSetting&)[async.map(audit)] calling writeAuditRecord for ' + JSON.stringify(document));
                writeAuditRecord(document, continuation);
            },
            function() {
                handler(save_err, { insert_count : insert_count, update_count : update_count, saved_settings : saved_settings } );
            }
        );
    }
};

module.exports = {
    Datastore : Datastore
}