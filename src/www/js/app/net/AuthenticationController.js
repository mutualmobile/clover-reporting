define(function(require) {
  var BaseController = require('app/net/BaseController'),
      Model = require('lavaca/mvc/Model'),
      localStore = require('app/cache/localStore'),
      stateModel = require('app/models/global/StateModel'),
      AgreementView = require('app/ui/pages/AgreementView'),
      SupportView = require('app/ui/pages/SupportView'),
      PrivacyView = require('app/ui/pages/PrivacyView'),
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
    },
    agreement: function(params, history) {
      return this
        .view(null, AgreementView, new Model())
        .then(this.updateState(history, 'End User Agreement', params.url, {hideHeader: true}));
    },
    privacy: function(params, history) {
      return this
        .view(null, PrivacyView, new Model())
        .then(this.updateState(history, 'Privacy Policy', params.url, {hideHeader: true}));
    },
    support: function(params, history) {
      return this
        .view(null, SupportView, new Model())
        .then(this.updateState(history, 'Support', params.url, {hideHeader: true}));
    }
  });

  return AuthenticationController;
});