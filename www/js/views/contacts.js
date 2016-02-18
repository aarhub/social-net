define(['views/contact', 'text!templates/contacts.html'],
    function (contactView, template) {
        var contactsView = Backbone.View.extend({
            el: $('#content'),

            initialize: function () {
                this.collection.on('reset', this.renderCollection, this);
            },

            render: function () {
                this.$el.html(template);
            },

            renderCollection: function (collection) {
                collection.each(function (contact) {
                    var statusHtml = (
                        new contactView({
                            removeButton: true,
                            model: contact
                        })
                    ).render().el;

                    $(statusHtml).appendTo('.contact_list');
                });

            }
        });

        return contactsView;
    }
);