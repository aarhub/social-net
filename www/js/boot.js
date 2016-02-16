require.config({
    baseUrl:'/js/',
    paths: {
        jQuery: 'libs/jQuery/2.1.4/jquery-2.1.4',
        Underscore: 'libs/underscore/1.8.3/underscore',
        Backbone: 'libs/backbone/1.2.0/backbone',
        models: 'models',
        text: 'libs/require/require.text',
        templates: 'views/templates',
        Sockets: 'libs/socket.io/socket.io'
    },

    shim: {
        'Backbone': ['Underscore', 'jQuery'],
        'main': ['Backbone']
    }
});

require(['main'], function (main) {
    main.initialize();
});