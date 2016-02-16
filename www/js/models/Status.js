define(function (require) {
    var status = Backbone.Model.extend({
        urlRoot: '/accounts/' + this.accountId + '/status'
    });

    return status;
});