define(['Sockets', 'models/ContactCollection', 'views/chat'], function (io, ContactCollection, chatView) {
    var socialNetSockets = function (eventDispatcher) {
        var accountId = null;

        var socket = null;

        var connectSocket = function () {
            socket = io.connect().socket;

            socket.on('connect', function () {
                eventDispatcher.bind('socket:chat:', sendChat);

                socket.on('chatServer', function (data) {
                    eventDispatcher.bind('socket:chat:start:' + data.from);
                    eventDispatcher.bind('socket:chat:in:' + data.from, data);
                });

                var contacts = new ContactCollection();
                contacts.url = '/accounts/me/contacts';
                new chatView({collection: contacts, socketEvents: eventDispatcher}).render();
                contacts.fetch();

            }).on('connectFailed', function (error) {
                console.log('Unable to connect:' + error);
            });
        };

        var sendChat = function (playload) {
            if (null != socket) {
                socket.emit('chatClient', playload);
            }
        };

        eventDispatcher.bind('app:loggedIn', connectSocket);
    };

    return {
        initialize: function (eventDispatcher) {
            socialNetSockets(eventDispatcher);
        }
    };
});