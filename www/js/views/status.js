define(['text!templates/status.html'], function (template) {
    var view = Backbone.View.extend({
        el: $('#content'),

        render: function () {
            this.$el.html(template);
        }
    });

    return view;
});