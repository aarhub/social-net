define(['text!templates/profile.html', 'text!templates/status.html', 'models/Status', 'views/status'],
    function (profileTemplate, statusTemplate, Status, statusView) {
        var profileView = Backbone.View.extend({
            el: $('#content'),

            events: {
                'submit form': 'postStatus'
            },

            initialize: function (options) {
                this.socketEvents = options.socketEvents;
                this.model.bind('change', this.render, this);
            },

            render: function () {
                var self = this;

                if (this.model.get('_id')) {
                    this.socketEvents.bind('status' + this.model.get('_id'), this.onSocketStatusAdded, this);
                }

                var that = this;
                this.$el.html(_.template(profileTemplate, this.model.toJSON()));

                var statusCollection = this.model.get('status');
                if (null != statusCollection) {
                    _.each(statusCollection, function (item) {
                        var status = new Status(item);
                        self.prependStatus(status);
                    });
                }
            },

            onSocketStatusAdded: function (obj) {
                var newStatus = obj.data;
                this.prependStatus(new Status({status: newStatus.status, name: newStatus.name}));
            },

            postStatus: function () {
                var self = this;
                var status = $('input[name=status]').val();

                $.post('/accounts/' + this.model.get('_id') + '/status', {status: status}, function (data) {
                    self.prependStatus(new Status({status: status}));
                });
            },

            prependStatus: function (status) {
                var html = (new statusView({model: status})).render().el;
                $(html).prependTo('.status_list').hide().fadeIn('slow');
            }
        });

        return profileView;
    });