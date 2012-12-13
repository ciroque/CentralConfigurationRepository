/**
 * Created with IntelliJ IDEA.
 * User: steve
 * Date: 12/12/12
 * Time: 8:41 PM
 * To change this template use File | Settings | File Templates.
 */

function CcrValuesPanel(valText, cacheText, effDateText, endDateText, serviceClient) {
    this.valText = valText;
    this.cacheText = cacheText;
    this.effDateText = effDateText;
    this.endDateText = endDateText;
    this.serviceClient = serviceClient;
};

CcrValuesPanel.prototype.clear = function() {
    $(this.valText).val();
    $(this.cacheText).val();
    $(this.effDateText).val();
    $(this.endDateText).val();
}

CcrValuesPanel.prototype.populate = function(environment, application, scope, setting, onError) {
    this.clear();
    var self = this;

    this.serviceClient.get(
        'setting',
        environment + '/' + application + '/' + scope + '/' + setting,
        function(response) {
            var value = response[0];
            $(self.valText).val(value.value);
            $(self.cacheText).val(value.temporalization.cache_lifetime);
            $(self.effDateText).val(value.temporalization.eff_date);
            $(self.endDateText).val(value.temporalization.end_date);
        },
         onError
    );

}