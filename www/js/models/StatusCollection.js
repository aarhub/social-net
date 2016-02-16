define(['models/Status'], function (status) {
    var statusCollection = Backbone.Collection.extend({
        model: status
    });

    return statusCollection;
});