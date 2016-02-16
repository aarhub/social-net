define(['models/Contact'], function (contact) {
    var contactCollection = Backbone.Collection.extend({
        model: contact
    });

    return contactCollection;
});