module.exports = function (config, mongoose, nodemailer) {
    var crypto = require('crypto');

    var Status = new mongoose.Schema({
        name: {
            first: {type: String},
            last: {type: String}
        },
        status: {type: String}
    });

    var Contact = new mongoose.Schema({
        name: {
            first: {type: String},
            last: {type: String}
        },
        accountId: {type: mongoose.Schema.ObjectId},
        added: {type: Date},
        updated: {type: Date}
    });

    var AccountSchema = new mongoose.Schema({
        email: {type: String, unique: true},
        password: {type: String},
        name: {
            first: {type: String},
            last: {type: String}
        },
        birthday: {
            day: {type: Number, min: 1, max: 31, required: false},
            month: {type: Number, min: 1, max: 12, required: false},
            year: {type: Number}
        },
        photoUrl: {type: String},
        biography: {type: String},
        contacts: [Contact],
        status: [Status],
        activity: [Status]
    });

    var Account = mongoose.model('Account', AccountSchema);

    var register = function (email, password, firstName, lastName) {
        var shaSum = crypto.createHash('sha256');
        shaSum.update(password);

        console.log('Registering ' + email);

        var user = new Account({
            email: email,
            name: {
                first: firstName,
                last: lastName
            },
            password: shaSum.digest('hex')
        });

        user.save(function (error) {
            if (error) {
                console.log(error);
            } else {
                console.log('Account was created.');
            }
        });
        console.log('Save command was sent');
    }

    var changePassword = function (accountId, newPassword) {
        var shaSum = crypto.createHash('sha256');
        shaSum.update(newPassword);

        var hashedPassword = shaSum.digest('hex');

        Account.update({_id: accountId}, {$set: {password: hashedPassword}}, {upsert: false}, function changePasswordCallback(error) {
            console.log('Change password done for account ' + accountId);
        });
    };

    var forgotPassword = function (email, resetPasswordUrl, callback) {
        var user = Account.findOne({email: email}, function findAccount(error, doc) {
            if (error) {
                callback(false);
            } else {
                var smtpTransport = nodemailer.createTransport('SMTP', config.mail);
                resetPasswordUrl += '?account=' + doc._id;

                ////Send a email for resetting password.
                smtpTransport.sendMail({
                    from: 'admin@www.com',
                    to: doc.email,
                    subject: 'Atom Social Net Password Request',
                    text: 'Click here to reset your password: ' + resetPasswordUrl
                }, function forgotPasswordResult(error) {
                    if (error) {
                        callback(false);
                    } else {
                        callback(true);
                    }
                });
            }
        });
    };

    var login = function (email, password, callback) {
        var shaSum = crypto.createHash('sha256');
        shaSum.update(password);

        Account.findOne({email: email, password: shaSum.digest('hex')}, function (error, doc) {
            callback(null != doc ? doc : null);
        });
    };

    var findByString = function (option, callback) {
        var regex = new RegExp(option, 'i');
        Account.find({
            $or: [
                {'name.full': {$regex: option}},
                {email: {$regex: regex}}
            ]
        }, callback);
    };

    var findById = function (accountId, callback) {
        Account.findOne({_id: accountId}, function (error, doc) {
            callback(doc);
        });
    };

    var addContact = function (account, contact) {
        contact = {
            name: contact.name,
            accountId: contact._id,
            added: new Date(),
            updated: new Date()
        };

        account.contacts.push(contact);

        account.save(function (error) {
            if (error) {
                console.log('Error saving account: ' + error);
            }
        });
    }

    var removeContact = function (account, contactId) {
        if (null == account.contacts) {
            return;
        }

        account.contacts.forEach(function (item) {
            if (item.accountId === contactId) {
                account.contacts.remove(contact);
            }
        });

        //TODO will be optimized
        account.save();
    };

    var hasContact = function (account, contactId) {
        if (null == account.contacts) {
            return false;
        }

        account.contacts.forEach(function (item) {
            if (item.accountId === contactId) {
                return true;
            }
        });

        return false;
    };

    return {
        Account: Account,
        register: register,
        login: login,
        forgotPassword: forgotPassword,
        changePassword: changePassword,
        findById: findById,
        findByString: findByString,
        addContact: addContact,
        removeContact: removeContact,
        hasContact: hasContact
    }
};

















