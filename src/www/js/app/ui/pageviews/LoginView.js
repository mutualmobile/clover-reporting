define(function(require) {

  var BasePageView = require('./BasePageView'),
      localStore = require('app/cache/localStore'),
      $ = require('jquery'),
      router = require('lavaca/mvc/Router');
  require('rdust!templates/login');

  /**
   * Login View
   * @class app.ui.pageviews.LoginView
   * @extends app.ui.pageviews.BasePageView
   */
  var LoginView = BasePageView.extend(function LoginView() {
    BasePageView.apply(this, arguments);
    this.mapEvent({
      form: {
        submit: _onFormSubmit.bind(this)
      }
    });
  }, {
    template: 'templates/login',
    className: 'login'
  });

  function _onFormSubmit(e) {
    var $form = $(e.currentTarget),
        merchantId = $form.find('#merchant-id').val().trim(),
        accessToken = $form.find('#access-token').val().trim();

    if (merchantId && accessToken) {
      localStore.set('merchantId', merchantId);
      localStore.set('accessToken', accessToken);
      router.exec('/');
    }
    e.preventDefault();
  }

  return LoginView;

});