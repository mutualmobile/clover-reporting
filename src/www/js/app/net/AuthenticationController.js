define(function(require) {
  var BaseController = require('app/net/BaseController'),
      Model = require('lavaca/mvc/Model'),
      localStore = require('app/cache/localStore'),
      stateModel = require('app/models/global/StateModel'),
      AgreementView = require('app/ui/pages/AgreementView'),
      SupportView = require('app/ui/pages/SupportView'),
      PrivacyView = require('app/ui/pages/PrivacyView'),
      LoginView = require('app/ui/pages/LoginView'),
      Device = require('lavaca/env/Device'),
      tracker = require('app/analytics/tracker'),
      router = require('lavaca/mvc/Router'),
      Config = require('lavaca/util/Config');

      var _isCordova = Device.isCordova();

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
    },
    getToken: function(params) {
      var login_url = Config.get('login_url');
      if (Device.isCordova()) {
        $.oauth2({
          auth_url: login_url,
          response_type: 'token',
          client_id: Config.get('app_id'),
          redirect_uri:'http://www.google.com'
          }, function(token, response){
            var tokenMatch = token.substring(0, token.indexOf('&')),
                merchantIdMatch = token.match(/merchant_id=([^&+]+)/);
            localStore.set('accessToken', tokenMatch);
            localStore.set('merchantId', merchantIdMatch[1]);
            stateModel.set('loggedIn', true);
            //tracker.setUserDimension('dimension1', '' + (!!stateModel.get('loggedIn')));
            router.exec('/');
          }, function(error, response){
             alert('There was an error authenticating, please try again');
          });
        }
        else {
          window.location = login_url+'?client_id='+Config.get('app_id');
        }
    }
  });

  return AuthenticationController;
});