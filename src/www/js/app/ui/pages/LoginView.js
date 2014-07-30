define(function(require) {

  var BaseView = require('app/ui/BaseView'),
      router = require('lavaca/mvc/Router');
  require('rdust!templates/login');
  require('rdust!templates/nonAuthHeader');
  require('rdust!templates/nonAuthFooter');

  /**
   * Login View
   * @class app.ui.pages.LoginView
   * @extends app.ui.BaseView
   */
  var LoginView = BaseView.extend(function LoginView() {
    BaseView.apply(this, arguments);
    this.mapEvent({
      'form': {
        'submit': _onFormSubmit.bind(this)
      }
    });
  }, {
    template: 'templates/login',
    className: 'login'
  });

  function _onFormSubmit(e) {
    e.preventDefault();
    var email = this.el.find('.email').val();
    var password = this.el.find('.password').val();
    setTimeout(function(){
      router.exec('/getToken', null, {
        email: email,
        password: password
      });
    }, 200);

    e.stopPropagation();
  }


  return LoginView;

});