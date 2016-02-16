module.exports = function (app, models) {
    app.post('/login/', function (req, res) {
        console.log('request login');

        var email = req.param('email', null);
        var password = req.param('password', null);

        if (null === email || email.length < 1 || null === password || password.length < 1) {
            res.send(400);
            return;
        }

        models.Account.login(email, password, function (account) {
            if (!account) {
                res.send(401);
                return;
            }

            req.session.loggedIn = true;
            req.session.accountId = account._id.toString();
            res.send(200);
        });
    });

    app.post('/register', function (req, res) {
        var firstName = req.param('firstName', '');
        var lastName = req.param('lastName', '');
        var email = req.param('email', null);
        var password = req.param('password', '');

        if (null == firstName || firstName.length < 1 || null == lastName || lastName.length < 1 || null == email || email.length < 1) {
            res.send(400);
            return;
        }

        models.Account.register(email, password, firstName, lastName);
        res.send(200);
    });

    app.get('/account/authenticated', function (req, res) {
        if (req.session.loggedIn) {
            res.sendStatus(200);
        } else {
            res.sendStatus(401);
        }
    });

    app.post('/forgotPassword', function (req, res) {
        var hostName = req.header.host;
        var resetPasswordUrl = 'http://' + hostName + '/resetPassword';
        var email = req.param('email', null);
        if (null === email || email.length < 1) {
            res.send(400);
            return;
        }

        models.Account.forgotPassword(email, resetPasswordUrl, function (success) {
            if (success) {
                res.send(200);
            } else {
                res.send(404);
            }
        });
    });

    app.get('/resetPassword', function (req, res) {
        var accountId = req.param('account', null);
        res.render('resetPassword.jade', {locals: {accountId: accountId}});
    });

    app.post('/resetPassword', function (req, res) {
        var accountId = req.param('account', null);
        var password = req.param('password', null);
        if (null != accountId && null != password) {
            models.Account.changePassword(accountId, password);
        }
        res.render('resetPasswordSuccess.jade');
    });
};