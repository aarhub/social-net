define(['views/chatSession', 'views/chatItem', 'text!templates/chat.html'], function (chatSessionView, chatItemView, chatTemplate) {
    var chatView = Backbone.View.extend({
        el: $('#chat'),

        chatSessions: {},

        initialize: function (options) {
            this.socketEvents = options.socketEvents;
            this.collection.on('reset', this.renderCollection, this);
        },

        render: function () {
            this.$el.html(chatTemplate);
        },

        startChatSession: function (model) {
            var accountId = model.get('accountId');
            if (!this.chatSessions[accountId]) {
                var chatSessionView = new ChatSessionView({
                    model: model,
                    socketEvents: this.socketEvents
                });

                this.$el.prepend(chatSessionView.render().el);
                this.chatSessions[accountId] = chatSessionView;
            }
        },

        renderCollection: function (collection) {
            var self = this;
            $('.chat_list').empty();
            collection.each(function (item) {
                var itemView = new ChatItemView({socketEvents: self.socketEvents, model: contact});

                chatItemView.bind('chat:start', self.startChatSession, self);
                var html = (chatItemView).render().el;
                $(html).appendTo('.chat_list');
            });
        }
    });

    return chatView;
});