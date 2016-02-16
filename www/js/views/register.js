define(['text!templates/register.html'], function (template) {
    var view = Backbone.View.extend({
        el: $('#content'),

        events: {
            'submit form': 'register'
        },

        render: function () {
            this.$el.html(template);
        },

        register: function () {
            $.post('/register', {
                firstName: $('input[name=firstName]').val(),
                lastName: $('input[name=lastName]').val(),
                email: $('input[name=email]').val(),
                password: $('input[name=password]').val(),
            }, function (data) {
                console.log(data);
            });

            return false;
        },
    });

    return view;
});