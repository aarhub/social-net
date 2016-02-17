define(['text!templates/chatitem.html'], function (chatItemTemplate) {
    var chatItemView = Backbone.View.extend({
        tagName: 'li',

        $el: $(this.el),

        events: {
            'click': 'startChatSession',
        },

        initialize: function (options) {
            var accountId = this.model.get('accountId')
            options.socketEvents.bind('socket:chat:start:' + accountId, this.startChatSession, this);
            options.socketEvents.bind('login:' + accountId, this.handleContactLogin, this);
            options.socketEvents.bind('logout:' + accountId, this.handleContactLogou, this)
        },

        render: function () {
            this.$el.html(_.template(chatItemTemplate, {model: this.model.toJSON()}));
            return this;
        },

        startChatSession: function () {
            this.trigger('chat:start', this.model);
        },

        handleContactLogin: function () {
            this.model.set('online', true);
            this.$el.find('.online_indicator').addClass('online');
        },

        handleContactLogou: function () {
            this.model.set('online', false);
            $onlineIndicator = this.$el.find('.online_indicator');
            while ($onlineIndicator.hasClass('online')) {
                $onlineIndicator.removeClass('online');
            }
        }
    });

    return chatItemView;
});