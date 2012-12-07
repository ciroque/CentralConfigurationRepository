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

/* *********************************************************************************************************************
 Private implementation
 ******************************************************************************************************************** */

function buildErrorDocument(invalid_params) {
    var error_doc = {};
    error_doc.message = 'The request is invalid due to problems with the parameters specified. Please correct the following issues and re-submit the request.';
    error_doc.issues = invalid_params;

    return error_doc;
}

/* *********************************************************************************************************************
 Exportation
 ******************************************************************************************************************** */

module.exports = {
    ParameterValidator : ParameterValidator
}