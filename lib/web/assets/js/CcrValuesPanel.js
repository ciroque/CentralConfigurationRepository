/**
 * Created with IntelliJ IDEA.
 * User: steve
 * Date: 12/12/12
 * Time: 8:41 PM
 * To change this template use File | Settings | File Templates.
 */

function CcrValuesPanel(valText, cacheText, effDateText, endDateText, settingId, serviceClient) {
    this.valText = valText;
    this.cacheText = cacheText;
    this.effDateText = effDateText;
    this.endDateText = endDateText;
    this.settingId = settingId;
    this.serviceClient = serviceClient;
    this.originalDocument = null;
};

CcrValuesPanel.prototype.clear = function() {
    $(this.valText).val('');
    $(this.cacheText).val('');
    $(this.effDateText).val('');
    $(this.endDateText).val('');
};

CcrValuesPanel.prototype.populate = function(environment, application, scope, setting, onError) {
    var self = this;
    var uri = buildPath(environment, application, scope, setting);
    this.serviceClient.get(
        'setting',
        uri,
        function(response) {
            var value = response[0];

            $(self.settingId).val(value._id);
            $(self.valText).val(value.value);
            $(self.cacheText).val(value.temporalization.cache_lifetime);
            $(self.effDateText).val(value.temporalization.eff_date);
            $(self.endDateText).val(value.temporalization.end_date);

            self.originalDocument = value;
        },
         onError
    );

};

CcrValuesPanel.prototype.update = function(environment, application, scope, setting, onError) {
    var self = this;
    var uri = buildPath(environment, application, scope, setting);
    var document = buildUpdateDocument.apply(this);

    $('#_dump').val(JSON.stringify(document));

    this.serviceClient.post(
        'schedule',
        uri,
        JSON.stringify(document),
        function(result) {
            alert(JSON.stringify(result));
        },
        onError
    );
};

function buildUpdateDocument() {
    var document = {};
    document.originalDocument = this.originalDocument;

    document.updatedDocument = {};
    document.updatedDocument.key = this.originalDocument.key;
    document.updatedDocument.value = $(this.valText).val();
    document.updatedDocument.temporalization = {};
    document.updatedDocument.temporalization.cache_lifetime = $(this.cacheText).val();
    document.updatedDocument.temporalization.eff_date = $(this.effDateText).val();
    document.updatedDocument.temporalization.end_date = $(this.endDateText).val();

    return document;
};

function buildPath(environment, application, scope, setting) {
    return environment + '/' + application + '/' + scope + '/' + setting;
};


/// --allow-file-access-from-files