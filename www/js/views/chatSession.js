define(['text!templates/chatsession.html'], function (chatItemSession) {
    var chatItemView = Backbone.View.extend({
        tagName: 'div',

        className: 'chat_session',

        $el: $(this.el),

        events: {'submit form': 'sendChat'},

        initialize: function (options) {
            this.socketEvents = options.socketEvents;
            this.socketEvents.on('socket:chat:in:' + this.model.get('accountId'), this.receiveChat, this);
        },

        receiveChat: function () {
        },

        sendChat: function () {

        },
    });

    return chatItemView;
});