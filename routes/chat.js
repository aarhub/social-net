module.exports = function (app, models) {
    var http = require('http').Server(app);
    var io = require('socket.io')(http);
    var cookie = require('cookie-parser');
    var session = require('express-session');

    //var sio = io.listen(app.server);
    //
    //io.configure(function () {
    //    io.set('authorization', function (data, accept) {
    //        var signedCookies = cookie.parse(data.headers.cookie);
    //    });
    //});

    io.use(function (data, accept) {
        var signedCookies = cookie.parse(data.headers.cookie);

    });

    io.on('connection', function (socket) {
        var session = socket.handshake.session;
        var accountId = session.accountId;
        socket.join(accountId);
    });
};