var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var session = require('express-session');
var nodeMailer = require('nodemailer');
var mongoose = require('mongoose');
var http = require('http');
var config = require('./config');

var app = express();

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));
app.use(logger('dev'));
app.use(bodyParser({limit: '1mb'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'www')));

app.sessionSecret = 'SocialNet secret key';
app.sessionStore =
    app.use(session({
        secret: app.sessionSecret,
        key: 'express.sid',
        store: app.sessionStore,
        resave: true,
        saveUninitialized: true
    }));

mongoose.connect(config.mongodb.server, function onMongooseError(error) {
    if (error) throw error;
});

var models = {
    Account: require('./models/Account')(config, mongoose, nodeMailer),
};

fs.readdirSync('routes').forEach(function (file) {
    if (file[0] === '.') return;
    var routeName = file.substr(0, file.indexOf('.'));
    require('./routes/' + routeName)(app, models);
});


var port = '3000';
var server = http.createServer(app);

server.listen(port);
console.log('Listening on port: ' + port);

app.get('/', function (req, res) {
    res.render('index.jade');
});

app.post('/contacts/find', function (req, res) {
    var options = req.param('searchOption', null);
    if (null == options) {
        res.send(400);
        return;
    }

    models.Account.findByString(options, function onSearchDone(error, accounts) {
        if (error || accounts.length == 0) {
            res.send(400);
        } else {
            res.send(accounts);
        }
    });
});


module.exports = app;

var events = require('events');

var eventDispatcher = new events.EventEmitter();
app.addEventListener = function (eventName, callback) {
    eventDispatcher.on(eventName, callback);
};
app.removeEventListener = function (eventName, callback) {
    eventDispatcher.removeListener(eventName, callback);
};
app.triggerEvent = function (eventName, eventOptions) {
    eventDispatcher.emit(eventName, eventOptions);
};

app.isAccountOnline=function(accountId){
    ///var clients=
}






























