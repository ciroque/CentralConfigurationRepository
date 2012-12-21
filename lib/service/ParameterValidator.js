/**
 * User: steve
 * Date: 7/20/12
 * Time: 1:09 PM
 */

/* *********************************************************************************************************************
 Construction
 ******************************************************************************************************************** */

function ParameterValidator() {

}

/* *********************************************************************************************************************
 Public interface
 ******************************************************************************************************************** */

ParameterValidator.prototype.validateFullSettingPath  = function(params, handler) {

    var invalid_params = [];
    var doc = {};

    ['environment', 'application', 'scope', 'setting'].forEach(
        function(key) {
            var value = params[key];

            if(value == null || value == '') {
                invalid_params.push({ name : key, problem : 'required but not present' });

            } else {
                doc[key] = value;

            }
        }
    );

    if(invalid_params.length > 0) {
        handler(buildErrorDocument(invalid_params), null);

    } else {
        handler(null, doc);

    }
};

ParameterValidator.prototype.validateSettingDocument = function(document, handler) {

    var validation_errors = [];

    ensureValidKey(document.key, validation_errors);
    ensureValidDate(document.temporalization, 'eff_date', new Date(1970, 00, 01), validation_errors);
    ensureValidDate(document.temporalization, 'end_date', new Date(9999, 11, 31), validation_errors);
    ensureValidCacheLifetime(document.temporalization, 'cache_lifetime', 600, validation_errors);

    var error_document = null;

    if(validation_errors.length > 0) {
        error_document = buildErrorDocument(validation_errors);
    }

    handler(error_document, document);
};

/* *********************************************************************************************************************
 Private implementation
 ******************************************************************************************************************** */

function buildErrorDocument(invalid_params) {
    var error_doc = {};
    error_doc.message = 'The request is invalid due to problems with the parameters specified. Please correct the following issues and re-submit the request.';
    error_doc.issues = invalid_params;

    return error_doc;
}

function ensureValidCacheLifetime(document, key, default_value, validation_errors) {
    var val = document[key];
    if(val === null || val === undefined) {
        document[key] = default_value;
    } else {
        if(isNaN(parseFloat(val)) || !isFinite(val)) {
            validation_errors.push({ name : key, problem : 'cache lifetime must be numeric'});
        }
    }
}

function ensureValidDate(document, key, default_value, validation_errors) {
    if(document[key] == null) {
        document[key] = default_value;
    } else {
        var date = document[key];
        var date_o = new Date(date);
        if(date_o == 'Invalid Date') {
            validation_errors.push( { name : key, problem : '"' + date + '" is an invalid date'});
        }
    }
}

function ensureValidKey(document, validation_errors) {
    var val = function(key) {
        if(document[key] === null || document[key] === undefined) {
            validation_errors.push({ name : key, problem : 'value for key field is required' })
        }
    }

    val('environment');
    val('application');
    val('scope');
    val('setting');
}

/* *********************************************************************************************************************
 Exportation
 ******************************************************************************************************************** */

module.exports = {
    ParameterValidator : ParameterValidator
}