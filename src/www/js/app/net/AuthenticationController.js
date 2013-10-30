define(function(require) {
  var BaseController = require('app/net/BaseController'),
      Model = require('lavaca/mvc/Model'),
      localStore = require('app/cache/localStore'),
      stateModel = require('app/models/StateModel'),
      LoginView = require('app/ui/pages/LoginView');

  /**
   * Authentication controller
   * @class app.net.AuthenticationController
   * @extends app.net.BaseController
   */
  var AuthenticationController = BaseController.extend(function AuthenticationController() {
    BaseController.apply(this, arguments);
  }, {
    login: function(params, history) {
      return this
        .view(null, LoginView, new Model())
        .then(this.updateState(history, 'Login', params.url, {hideHeader: true}));
    },
    logout: function() {
      localStore.remove('merchantId');
      localStore.remove('accessToken');
      stateModel.set('loggedIn', false);
      return this.redirect('/login');
    }
  });

  return AuthenticationController;
});