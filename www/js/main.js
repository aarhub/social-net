define(['router'], function (router) {
    var initialize = function () {
        checkLogin(runApp);
    }

    var checkLogin = function (callback) {
        $.ajax('/account/authenticated', {
            method: 'GET',
            success: function () {
                return callback(true);
            },
            error: function (error) {
                return callback(false);
            },
        });
    };

    var runApp = function (authenticated) {
        if (authenticated) {
            window.location.hash = 'index';
        } else {
            window.location.hash = 'login';
        }

        Backbone.history.start();
    };

    return {
        initialize: initialize
    };
});