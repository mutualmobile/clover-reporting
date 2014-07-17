define(function(require) {

  var BaseView = require('app/ui/BaseView');
  require('rdust!templates/support');
  require('rdust!templates/nonAuthHeader');
  require('rdust!templates/nonAuthFooter');

  /**
   * Agreement View
   * @class app.ui.pages.SupportView
   * @extends app.ui.BaseView
   */
  var SupportView = BaseView.extend(function SupportView() {
    BaseView.apply(this, arguments);
  }, {
    template: 'templates/support',
    className: 'support agreement'
  });

  return SupportView;

});