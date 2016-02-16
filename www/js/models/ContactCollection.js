define(['models/Contact'], function (Contact) {
    var contactCollection = Backbone.Collection.extend({
        model: Contact
    });

    return contactCollection;
});