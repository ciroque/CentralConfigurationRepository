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

    log_writer.writeDebug('(&DataStore::ctor&) settings => ' + JSON.stringify(settings));
}

/* *********************************************************************************************************************
    Public interface
 ******************************************************************************************************************** */

DataStore.prototype.deleteSetting = function(key, handler) {
    this.log_writer.writeDebug('(&DataStore::deleteSetting&) find_parameters -> ' + JSON.stringify(key));

    var database = buildMongoDbInstance(this.settings);

    runInSettingsCollection(
        this,
        database,
        function(err, collection) {
            collection.remove(
                key,
                function(err, result) {
                    if(err) {
                        this.log_writer.writeError(err);
                    }

                    handler(err, result);
                }
            );
        }
    )
};

DataStore.prototype.insertSetting = function(document, handler) {
    this.log_writer.writeDebug('(&DataStore::insertSetting&) find_parameters -> ' + JSON.stringify(document));

    var datastore = buildMongoDbInstance(this.settings);

    runInSettingsCollection(
        this,
        datastore,
        function(err, collection) {
            collection.insert(document, handler);
        }
    );
}

/**
 *
 * @param environment
 * @param application
 * @param scope
 * @param setting
 * @param handler
 */
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

    this.log_writer.writeDebug('(&DataStore::retrieveActiveSetting&) find_parameters -> ' + JSON.stringify(find_parameters));

    var datastore = buildMongoDbInstance(this.settings);

    findSettingInCollection(this, datastore, find_parameters, handler);
};

/**
 *
 * @param environment
 * @param application
 * @param scope
 * @param setting
 * @param handler
 */
DataStore.prototype.retrieveSettingSchedule = function(
    environment,
    application,
    scope,
    setting,
    handler) {

    var find_parameters = buildFindParameters(
        this,
        environment,
        application,
        scope,
        setting,
        buildQuery
    );

    this.log_writer.writeDebug('(&DataStore::retrieveSettingSchedule&) find_parameters -> ' + JSON.stringify(find_parameters));

    var database = buildMongoDbInstance(this.settings);

    findSettingInCollection(this, database, find_parameters, handler);

};

DataStore.prototype.updateSetting = function(update_params, handler) {
    this.log_writer.writeDebug('(&DataStore::updateSetting&) ' + JSON.stringify(update_params));

    var query_doc = {
        'key.environment' : update_params.originalDocument.key.environment,
        'key.application' : update_params.originalDocument.key.application,
        'key.scope' : update_params.originalDocument.key.scope,
        'key.setting' : update_params.originalDocument.key.setting
    };

    var sort_doc = {
        'key.environment' : 1,
        'key.application' : 1,
        'key.scope' : 1,
        'key.setting' : 1,
        'temporalization.end_date' : -1
    }

    var new_doc = update_params.updatedDocument;

    this.log_writer.writeDebug('(&DataStore::updateSetting&) new_doc = ' + JSON.stringify(new_doc));

    var datastore = buildMongoDbInstance(this.settings);

    var ctxt = this;

    runInSettingsCollection(
        this,
        datastore,
        function(err, collection) {
            collection.findAndModify(
                query_doc,
                sort_doc,
                new_doc,
                { safe : true, new : true },
                function(err, object) {
                    if(err) {
                        ctxt.log_writer.writeError('(&DataStore::updateSetting&)[collection.findAndModify] MSG => ' + JSON.stringify(err));
                    }

                    ctxt.log_writer.writeDebug('(&DataStore::updateSetting&)[collection.findAndModify] object => ' + JSON.stringify(object));

                    handler(err, object);
                }
            );
        }
    );
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
function buildFindParameters(ctxt, env, app, scope, setting, query_builder) {

    if(query_builder == null) {
        query_builder = buildQueryWithDateRestriction;
    }

    var discriminator = buildDiscriminatorSettingsObject(env, app, scope, setting);
    var query = query_builder(ctxt, env, app, scope, setting);

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
        settings.datastore.hostname,
        settings.datastore.port,
        {}
    );

    return new MongoDatabase(
        settings.datastore.database_name,
        server,
        { journal: true }
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
function runInSettingsCollection(ctxt, database, handler) {
    database.open(
        function(err, db) {
            if(err != null) {
                ctxt.log_writer.writeError('(&DataStore::queryCollection&)[database.open]\t' + err);
                handler(err, null);

            } else {
                db.collection(
                    ctxt.settings.datastore.collection_names.settings_collection,
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
    runInSettingsCollection(
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