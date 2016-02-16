define(
    [
        'views/index',
        'views/register',
        'views/login',
        'views/forgotPassword',
        'views/profile',
        'views/contacts',
        'views/addContact',
        'models/Account',
        'models/StatusCollection',
        'models/ContactCollection'
    ],
    function (indexView,
              registerView,
              loginView,
              forgotPasswordView,
              profileView,
              contactsView,
              addContactView,
              Account,
              StatusCollection,
              ContactCollection) {
        var SocialRouter = Backbone.Router.extend({
            currentView: null,

            socketEvents: _.extend({}, Backbone.Events),

            routes: {
                'index': 'index',
                'login': 'login',
                'register': 'register',
                'forgotPassword': 'forgotPassword',
                'profile/:id': 'profile',
                'contacts/:id': 'contacts'
            },

            index: function () {
                var statusCollection = new StatusCollection();
                statusCollection.url = '/accounts/me/activity';
                this.changeView(new indexView({collection: statusCollection}));
                statusCollection.fetch();
            },

            login: function () {
                this.changeView(new loginView({socketEvents: this.socketEvents}));
            },

            register: function () {
                this.changeView(new registerView());
            },

            forgotPassword: function () {
                this.changeView(new forgotPasswordView());
            },

            profile: function (id) {
                var model = new Account({id: id});
                this.changeView(new profileView({model: model}));
                model.fetch();
            },

            contacts: function (id) {
                var contactId = id ? id : 'me';
                var contacts = new ContactCollection();
                contacts.url = '/account/' + contactId + '/contacts';
                this.changeView(new contactsView({}));
            },

            changeView: function (view) {
                if (null != this.currentView) {
                    this.currentView.undelegateEvents();
                }

                this.currentView = view;
                this.currentView.render();
            }
        });

        return new SocialRouter();
    });