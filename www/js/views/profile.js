define(['text!templates/profile.html', 'text!templates/status.html', 'models/Status', 'views/Status'],
    function (profileTemplate, statusTemplate, Status, StatusView) {
        var profileView = Backbone.View.extend({
            el: $('#content'),

            events: {
                'submit form': 'postStatus'
            },

            initialize: function () {
                this.model.bind('change', this.render, this);
            },

            render: function () {
                var that = this;
                this.$el.html(_.template(profileTemplate, this.model.toJSON()));

                var statusCollection = this.model.get('status');
                if (null != statusCollection) {
                    _.each(statusCollection, function (item) {
                        var status = new Status(item);
                        this.prependStatus(status);
                    });
                }
            },

            postStatus: function () {
                var self = this;
                var status = $('input[name=status]').val();

                $.post('/accounts/' + this.model.get('_id') + '/status', {status: status},
                    function (data) {
                        self.prependStatus(new Status({status: status}));
                    });
            },

            prependStatus: function (status) {
                var html = (new StatusView({model: status})).render().el;
                $(html).prependTo('.status_list').hide().fadeIn('slow');
            }
        });

        return profileView;
    });