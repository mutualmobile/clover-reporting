define(function(require) {

  var BaseView = require('app/ui/BaseView');
  require('rdust!templates/end-user-agreement');

  /**
   * Agreement View
   * @class app.ui.pages.AgreementView
   * @extends app.ui.BaseView
   */
  var AgreementView = BaseView.extend(function AgreementView() {
    BaseView.apply(this, arguments);
  }, {
    template: 'templates/end-user-agreement',
    className: 'agreement'
  });

  return AgreementView;

});