/**
 * User: steve
 * Date: 7/16/12
 * Time: 2:36 PM
 */

var mongodb_module = require('mongodb');

var MongoServer = mongodb_module.Server;
var MongoDatabase = mongodb_module.Db;

/* *********************************************************************************************************************
    Global Constants
 ******************************************************************************************************************** */
var SETTINGS_DOC_KEY_APPLICATION = 'key.application';
var SETTINGS_DOC_KEY_SCOPE = 'key.scope';
var SETTINGS_DOC_KEY_SETTING = 'key.setting';

var SETTINGS_DOC_TEMPORALIZATION_EFF_DATE = 'temporalization.eff_date';
var SETTINGS_DOC_TEMPORALIZATION_END_DATE = 'temporalization.end_date';

/* *********************************************************************************************************************
    Construction
 ******************************************************************************************************************** */

function DataStore(settings, log_writer) {
    this.settings = settings;
    this.log_writer = log_writer;
}

/* *********************************************************************************************************************
    Public interface
 ******************************************************************************************************************** */

DataStore.prototype.retrieveActiveSetting = function(
    environment,
    application,
    scope,
    setting,
    handler
    ) {

    var find_parameters = buildFindParameters(
        this,
        environment,
        application,
        scope,
        setting
    );

    var database = buildMongoDbInstance(this.settings);

    findSettingInCollection(this, database, find_parameters, handler);
};

/* *********************************************************************************************************************
 Private implementation
 ******************************************************************************************************************** */

/**
 * Analayzes the given parameters and builds an appropriate discriminator object to satisfy the request.
 * @param env
 * @param app
 * @param scope
 * @param setting
 * @return {Object}
 */
function buildDiscriminatorSettingsObject(env, app, scope, setting) {
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

/**
 * Analayzes the given parameters and builds an object that contains a discriminator to describe the
 * expected results and query parameters to yields those results from the database.
 * @param env
 * @param app
 * @param scope
 * @param setting
 */
function buildFindParameters(ctxt, env, app, scope, setting) {
    var discriminator = buildDiscriminatorSettingsObject(env, app, scope, setting);
    var query = buildQueryWithDateRestriction(ctxt, env, app, scope, setting);

    return {
        'requested_environment' : env,
        'query' : query,
        'fields' : discriminator.fields,
        'distinct' : discriminator.distinct };
}

/**
 * Creates a new instance of the MongoDb Db class.
 * @param settings - the settings the provide the hostname, port, and database name.
 * @return - an initialized instance of the MongoDb Db class.
 */
function buildMongoDbInstance(settings) {
    var server = new MongoServer(
        settings.data_store.hostname,
        settings.data_store.port,
        {}
    );

    return new MongoDatabase(
        settings.data_store.database_name,
        server
    );
}

/**
 * Builds a query object instance using the given parameters.
 * @param env
 * @param app
 * @param scope
 * @param setting
 * @return {Object}
 */
function buildQuery(ctxt, env, app, scope, setting) {
    var query = {};

    if(env != null) {

        query['$or'] = [
            { 'key.environment' : env },
            { 'key.environment' : ctxt.settings.defaults.default_environment }
        ];
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

/**
 * Builds a query object having date restrictions applied.
 * @param env
 * @param app
 * @param scope
 * @param setting
 * @return {Object}
 */
function buildQueryWithDateRestriction(ctxt, env, app, scope, setting) {
    var query = buildQuery(ctxt, env, app, scope, setting);
    var current_date = new Date(new Date().toISOString());
    query[SETTINGS_DOC_TEMPORALIZATION_EFF_DATE] = { $lte : current_date };
    query[SETTINGS_DOC_TEMPORALIZATION_END_DATE] = { $gte : current_date };

    return query;
}

/**
 * Opens a collection on the given database and hands the collection interface to the callback handler.
 * @param ctxt - the context under which the method is being run.
 * @param database - the database containing the collection to be opened.
 * @param handler - the callback method to hand off the opened collection.
 *
 * NOTE: Need to use .bind(this) when calling so that 'this' is the context of the caller...
 */
function queryCollection(ctxt, database, handler) {
    database.open(
        function(err, db) {
            if(err != null) {
                ctxt.log_writer.writeError('(&DataStore::queryCollection&)[database.open]\t' + err);
                handler(err, null);

            } else {
                db.collection(
                    ctxt.settings.data_store.collection_names.settings_collection,
                    function(err, collection) {
                        if(err != null) {
                            ctxt.log_writer.writeError('(&DataStore::queryCollection&)[db.collection]\t' + err);
                            handler(err, null);

                        } else {
                            handler(null, collection);

                        }
                    }
                );
            }
        }
    );
}

function findSettingInCollection(ctxt, database, find_parameters, handler) {
    queryCollection(
        ctxt,
        database,
        function(err, collection) {
            if(err != null) {
                ctxt.log_writer.writeError('(&DataStore::findSettingInCollection&)[queryCollection]\t' + err);
                handler(err, null);

            } else {

                if(find_parameters.distinct != null) {
                    ctxt.log_writer.writeDebug('(&DataStore::findSettingInCollection&)[queryCollection] useDistinct');

                    useDistinct(
                        collection,
                        find_parameters,

                        function(err, cursor) {
                            ctxt.log_writer.writeDebug('(&DataStore::findSettingsInCollection&)[useDistinct]::' + JSON.stringify(cursor));

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
                    ctxt.log_writer.writeDebug('(&DataStore::findSettingInCollection&)[queryCollection] useFind');

                    useFind(
                        collection,
                        find_parameters,
                        function(err, cursor) {
                            if(err != null) {
                                handler(err, null);
                            } else {
//                                cursor.count(
//                                    function(err, count) {
                                            cursor.toArray(
                                                function(err, docs) {
                                                    if(err != null) {
                                                        ctxt.log_writer.writeError('(&DataStore::findSettingInCollection&)[useFind] error: ' + err);
                                                        handler(err, null);

                                                    } else {
                                                        handler(null, docs);

                                                    }
                                                }
                                            );
//                                    }
//                                );
                            }
                        }
                    );

                }
            }
        }
    );
}

/**
 * Queries the collection using the distinct method.
 * @param collection
 * @param params
 * @param handler
 */
function useDistinct(collection, params, handler) {
    collection.distinct(
        params.distinct,
        params.query,
        handler
    )
}

/**
 * Queries the collection using the find method.
 * @param collection
 * @param params
 * @param handler
 */
function useFind(collection, params, handler) {
    collection.find(
        params.query,
        params.fields,
        handler
    );
}


/* *********************************************************************************************************************
    Exportation
 ******************************************************************************************************************** */

module.exports = {
    DataStore : DataStore
};