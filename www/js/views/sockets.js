define(['Sockets', 'models/ContactCollection', 'views/chat'], function (io, ContactCollection, chatView) {
    var SocialNetSockets = function (eventDispatcher) {
        var socket = null;

        var connectSocket = function () {
            socket = io.connect().socket;

            socket.on('connect', function () {
                eventDispatcher.bind('socket:chat:', sendChat);

                socket.on('chatserver', function (data) {
                    eventDispatcher.bind('socket:chat:start:' + data.from);
                    eventDispatcher.bind('socket:chat:in:' + data.from, data);
                });

                var contacts = new ContactCollection();
                contacts.url = '/accounts/me/contacts';
                new ChatView({collection: contacts, socketEvents: eventDispatcher}).render();
                contacts.fetch();

            }).on('connect_failed', function (error) {
                console.log('Unable to connect:' + error);
            });
        };

        var sendChat = function (playload) {
            if (null != socket) {
                socket.emit('chatclient', playload);
            }
        };

        eventDispatcher.bind('app:loggedin', connectSocket);
    };

    return {
        initialize: function (eventDispatcher) {
            SocialNetSockets(eventDispatcher);
        }
    };
});