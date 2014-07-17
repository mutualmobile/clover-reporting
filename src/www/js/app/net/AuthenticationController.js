define(function(require) {
  var BaseController = require('app/net/BaseController'),
      Model = require('lavaca/mvc/Model'),
      localStore = require('app/cache/localStore'),
      stateModel = require('app/models/global/StateModel'),
      AgreementView = require('app/ui/pages/AgreementView'),
      SupportView = require('app/ui/pages/SupportView'),
      PrivacyView = require('app/ui/pages/PrivacyView'),
      LoginView = require('app/ui/pages/LoginView'),
      Connectivity = require('lavaca/net/Connectivity'),
      Device = require('lavaca/env/Device'),
      Promise = require('lavaca/util/Promise'),
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
      var email = params.email,
          password = params.password,
          endpoint = 'oauth/token',
          tokenURL = Config.get('auth_url') + endpoint,
          proxyTokenURL = Config.get('auth_proxy_url') + endpoint,
          promise = new Promise();
      
      Connectivity.ajax({
        url: _isCordova ? tokenURL : proxyTokenURL,
        dataType: 'json',
        type: 'POST',
        data: JSON.stringify({
          clientId: Config.get('app_id'),
          email: email,
          password: password
        }),
        contentType: 'application/json'
      })
      .success(function(data) {
        if (_isCordova) {
          //navigationCommunication.init().loggedIn(true);
        }
        localStore.set('accessToken', data.access_token);
        localStore.set('merchantId', 'RZC2F4FMKFJ12');
        stateModel.set('loggedIn', true);

        localStorage.setItem('token', data.access_token);
        promise.when(this.redirect('/'));
      }.bind(this))
      .error(function() {
        alert('Error authenticating. Please try again.');
        promise.reject();
      });
      return promise;
    }
  });

  return AuthenticationController;
});