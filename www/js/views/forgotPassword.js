define(['text!templates/forgotPassword.html'], function (template) {
    var view = Backbone.View.extend({
        el: $('#content'),

        events: {
            'submit form': 'resetPassword'
        },

        render: function () {
            this.$el.html(template);
        },

        resetPassword: function () {
            $.post('/forgotPassword', {email: $('input[name=email]').val()}, function (data) {
                console.log(data);
            });

            return false;
        }
    });

    return view;
});