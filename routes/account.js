module.exports = function (app, models) {
    app.get('/accounts/:id/contacts', function (req, res) {
        var accountId = req.params.id === 'me' ? req.session.accountId : req.params.id;
        models.Account.findById(accountId, function (account) {
            res.send(account.contacts);
        });
    });

    app.post('/contacts/find', function (req, res) {
        var searchOption = req.param('searchOption', null);
        if (null == searchOption) {
            res.send(400);
            return;
        }

        models.Account.findByString(searchOption, function onSearchDown(error, accounts) {
            if (error || accounts.length === 0) {
                res.send(400);
            } else {
                res.send(accounts);
            }
        });
    });

    app.post('/accounts/:id/contact', function (req, res) {
        var accountId = req.params.id === 'me' ? req.session.accountId : req.params.id;
        var contactId = req.param('contactId', null);

        if (null == contactId) {
            res.send(400);
            return;
        }

        models.Account.findById(accountId, function (account) {
            if (account) {
                models.Account.findById(contactId, function (contact) {
                    models.Account.addContact(account, contact);

                    //// Make the reserve link
                    models.Account.addContact(contact, account);
                    account.save();
                })
            }
        });
    });

    app.delete('/accounts/:id/contact', function (req, res) {
        var accountId = req.params.id === 'me' ? req.session.accountId : req.params.id;

        var contactId = req.param('contactid', null);

        if (null == contactId) {
            res.send(400);
            return;
        }

        models.Account.findById(accountId, function (account) {
            if (!account) {
                return;
            }

            models.Account.findById(contactId, function (contact) {
                if (!contact) {
                    return;
                }

                models.Account.removeContact(account, contactId);
                models.Account.removeContact(contact, accountId);
            });

            res.send(200);
        });
    });

    app.get('/accounts/:id', function (req, res) {
        var accountId = req.params.id === 'me' ? req.session.accountId : req.params.id;

        models.Account.findById(accountId, function (account) {
            if (accountId === 'me' || models.Account.hasContact(account, req.session.accountId)) {
                account.isFriend = true;
            }

            res.send(account);
        });
    });

    app.get('/accounts/:id/status', function (req, res) {
        var accountId = req.params.id === 'me' ? req.session.accountId : req.params.id;

        models.Account.findById(accountId, function (account) {
            res.send(account.status);
        });
    });

    app.post('/accounts/:id/status', function (req, res) {
        var accountId = req.params.id === 'me' ? req.session.accountId : req.params.id;

        models.Account.findById(accountId, function (account) {
            var status = {
                name: account.name,
                status: req.param('status', '')
            };
            account.status.push(status);

            account.activity.push(status);
            account.save(function (error) {
                if (error) {
                    console.log('Error saving account: ' + error);
                }
            });
        });

        res.send(200);
    });

    app.get('/accounts/:id/activity', function (req, res) {
        var accountId = req.params.id === 'me' ? req.session.accountId : req.params.id;

        models.Account.findById(accountId, function (account) {
            account.activity && res.send(account.activity);
        });
    });
};