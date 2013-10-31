define(function(require) {

  var BaseView = require('app/ui/BaseView'),
      localStore = require('app/cache/localStore'),
      stateModel = require('app/models/global/StateModel'),
      $ = require('$'),
      router = require('lavaca/mvc/Router');
  require('rdust!templates/login');

  /**
   * Login View
   * @class app.ui.pages.LoginView
   * @extends app.ui.BaseView
   */
  var LoginView = BaseView.extend(function LoginView() {
    BaseView.apply(this, arguments);
    this.mapEvent({
      'button': {
        tap: _onFormSubmit.bind(this)
      },
      'input': {
        keypress: _onFormSubmit.bind(this)
      },
      'self': {
        touchmove: _onTouchmove
      },
      'form': {
        submit: _onFormSubmit.bind(this)
      }
    });
  }, {
    template: 'templates/login',
    className: 'login'
  });

  function _onTouchmove(e) {
    e.stopPropagation();
  }

  function _onFormSubmit(e) {
    var $form = $(e.currentTarget).parents('form'),
        merchantId = $form.find('#merchant-id').val().trim(),
        accessToken = $form.find('#access-token').val().trim();
    if (e.type !== 'keypress' || (e.keyCode && e.keyCode === 13)) {
      if (merchantId && accessToken) {
        localStore.set('merchantId', merchantId);
        localStore.set('accessToken', accessToken);
        stateModel.set('loggedIn', true);
        router.exec('/');
      }
      e.preventDefault();
    }
  }

  return LoginView;

});