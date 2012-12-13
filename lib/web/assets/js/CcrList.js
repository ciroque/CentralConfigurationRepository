/**
 * Created with IntelliJ IDEA.
 * User: steve
 * Date: 12/10/12
 * Time: 9:07 PM
 * To change this template use File | Settings | File Templates.
 */

function CcrList(listId, segment, serviceClient, subordinateLists) {
    this.segment = segment;
    this.listId = listId;
    this.serviceClient = serviceClient;
    this.endpoint = 'schedule';
    this.subordinateLists = subordinateLists;
};

CcrList.prototype.clear = function() {
    $.each(this.subordinateLists, function(index, item) { item.clear(); });
    var options = $("select#" + this.listId).prop('options');
    var length = options.length;
    while(length > 0) { options[0] = null; length--; }
};

CcrList.prototype.populate = function(path, onError) {
    this.clear();
    var self = this;
    this.serviceClient.get(
        this.endpoint,
        path,
        function(response) {
            var options = [];
            $.each(
                response,
                function(index, item) {
                    options.push(item['key'][self.segment]);
                }
            );
            updateOptions(
                $("select#" + self.listId).prop('options'),
                options);
        },
        onError
    );

};

CcrList.prototype.selected = function() {
    return $('select#' + this.listId).val();
};

function updateOptions(options, newOptions) {
    if(Array.isArray(newOptions)) {
        $.each(
            newOptions,
            function(index, item) {
                options[options.length] = new Option(item);
            }
        );
    }
}
