define(['text!templates/contact.html'], function (template) {
    var view = Backbone.View.extend({
        addButton: false,

        removeButton: false,

        tagName: 'li',

        events: {
            'click #addContact': 'addContact',
            'click #removeContact': 'removeContact'
        },

        initialize: function (options) {
            this.options = options || {}
            if (this.options.addButton) {
                this.addButton = this.options.addButton;
            }

            if (this.options.removeButton) {
                this.removeButton = this.options.removeButton;
            }
        },

        render: function () {
            var obj = {
                model: this.model.toJSON(),
                addButton: this.addButton,
                removeButton: this.removeButton
            };

            this.$el.html(_.template(template)(obj));

            return this;
        },

        addContact: function () {
            var $responseArea = this.$('.actionArea');
            $.post('/accounts/me/contact',
                {contactId: this.model.get('_id')},
                function onSuccess() {
                    $responseArea.text('Contact Added');
                },
                function onError() {
                    $responseArea.text('Could not add contact;');
                });
        },

        removeContact: function () {
            var $responseArea = this.$('.actionArea');
            $responseArea.text('Removing contact...');

            $.ajax({
                url: '/accounts/me/contact',
                type: 'DELETE',
                data: {contactId: this.model.get('accountId')}
            }).done(function onSuccess() {
                $responseArea.text('Contact Removed');
            }).fail(function onError() {
                $responseArea.text('Could not remove contact');
            });
        },


    });

    return view;
});