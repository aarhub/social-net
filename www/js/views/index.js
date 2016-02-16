define(['text!templates/index.html', 'views/status', 'models/Status'],
    function (template, statusView, Status) {
        var view = Backbone.View.extend({
            el: $('#content'),

            collection: null,

            events: {
                'submit form': 'updateStatus'
            },

            initialize: function (options) {
                this.collection = options.collection;
                this.collection.on('add', this.addStatus, this);
                this.collection.on('reset', this.resetStatusCollection, this);
            },

            render: function () {
                this.$el.html(template);
            },

            addStatus: function () {
                var html = (new statusView({model: status})).render().el;
                $(html).prependTo('.status_list').hide().fadeIn('slow');
            },

            updateStatus: function () {
                var self = this;
                var sta = $('input[name=status]').val();

                $.post('/accounts/me/status', {status: sta}, function (data) {
                    self.collection.add(new Status({status: sta}));
                });

                return false;
            },

            resetStatusCollection: function (collection) {
                var self = this;
                collection.each(function (model) {
                    self.addStatus(model);
                });
            },
        });
        return view;
    });