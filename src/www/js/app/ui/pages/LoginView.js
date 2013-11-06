define(function(require) {

  var BaseView = require('app/ui/BaseView');
  require('rdust!templates/login');

  /**
   * Login View
   * @class app.ui.pages.LoginView
   * @extends app.ui.BaseView
   */
  var LoginView = BaseView.extend(function LoginView() {
    BaseView.apply(this, arguments);
  }, {
    template: 'templates/login',
    className: 'login'
  });

  return LoginView;

});