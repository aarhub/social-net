define(['text!templates/login.html'], function (loginTemplate) {
    var loginView = Backbone.View.extend({
        el: $('#content'),

        socketEvents: null,

        events: {
            'submit form': 'login'
        },

        render: function () {
            this.$el.html(loginTemplate);
            $('#error').hide();
        },

        initialize: function (options) {
            this.socketEvents = options.socketEvents;
        },

        login: function () {
            var socketEvents = this.socketEvents;
            $.post('/login', {email: $('input[name=email]').val(), password: $('input[name=password]').val()}, function (data) {
                socketEvents.trigger('app:login');
                window.location.hash = 'index';
            }).error(function () {
                $('#error').text('Unable to login.').slideDown();
            });

            return false;
        }
    });

    return loginView
});