define(['text!templates/status.html'], function (template) {
    var view = Backbone.View.extend({

        initialize: function (options) {
            this.model = options;
        },

        render: function () {
           return this.$el.html(template, this.model);
        }
    });

    return view;
});