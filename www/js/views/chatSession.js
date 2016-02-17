define(['text!templates/chatSession.html'], function (template) {
    var view = Backbone.View.extend({
        tagName: 'div',

        className: 'chat_session',

        $el: $(this.el),

        events: {'submit form': 'sendChat'},

        initialize: function (options) {
            var accountId = this.model.get('accountId');

            this.socketEvents = options.socketEvents;

            this.socketEvents.on('socket:chat:in:' + accountId, this.receiveChat, this);
            this.socketEvents.on('login:' + accountId, this.handleContactLogin, this);
            this.socketEvents.on('logout:' + accountId, this.handleContactLogout, this);
        },

        render: function () {
            this.$el.html(_.template(template, {model: this.model.toJSON()}));
        },

        receiveChat: function () {
            this.$el.find('.chat_log').append('<li>' + this.model.get('name').first + ':' + data.text + '</li>')
        },

        sendChat: function () {
            var msg = this.$el.find('input[name=chat]').val();
            if (msg && /[^\s]+/.test(msg)) {
                var line = 'Me:' + msg;
                this.$el.find('.chat_log').append('<li>' + line + '</li>');
                this.socketEvents.trigger('socket:chat', {
                    to: this.model.get('accountId'),
                    text: line
                })
            }

            return false;
        },

        handleContactLogin: function () {
            this.$el.find('.online_indicator').addClass('online');
            this.model.set('online', true);
        },

        handleContactLogout: function () {
            this.model.set('online', false);
            $onlineIndicator = this.$el.find('.online_indicator');
            while ($onlineIndicator.hasClass('online')) {
                $onlineIndicator.removeClass('online');
            }
        }
    });

    return view;
});