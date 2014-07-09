define(function(require) {

  var BaseView = require('app/ui/BaseView');
  require('rdust!templates/privacy-policy');

  /**
   * Agreement View
   * @class app.ui.pages.PrivacyView
   * @extends app.ui.BaseView
   */
  var PrivacyView = BaseView.extend(function PrivacyView() {
    BaseView.apply(this, arguments);
  }, {
    template: 'templates/privacy-policy',
    className: 'agreement'
  });

  return PrivacyView;

});