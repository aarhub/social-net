define(['models/Contact', 'views/contact', 'text!templates/addContact.html'],
    function (Contact, contactView, template) {
        var view = Backbone.View.extend({
            el: $('#content'),

            events: {
                'submit form': 'search'
            },

            render: function (contacts) {
                var self = this;
                this.$el.html(_.template(template));
                if (null != contacts) {
                    _.each(contacts, function (item) {
                        var model = new Contact(item);
                        var html = (new contactView({addButton: true, model: model})).render().el;

                        $('#results').append(html);
                    });
                }
            },

            search: function () {
                var self = this;

                $.post('/contacts/find', this.$('form').serialize(), function (data) {
                    self.render(data);
                }).error(function () {
                    $('#results').text('No contacts found.');
                    $('#results').slideDown();
                });

                return false;
            }
        });

        return view;
    });