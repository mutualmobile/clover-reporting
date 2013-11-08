define(function(require) {
  var BaseView = require('app/ui/BaseView');
  require('rdust!templates/detail_metrics_panel');

  /**
   * Employee Detail View
   * @class app.ui.metrics.MetricsDetailView
   * @extends app.ui.BaseView
   */
  var MetricsDetailView = BaseView.extend(function MetricsDetailView() {
    BaseView.apply(this, arguments);
  }, {
    template: 'templates/detail_metrics_panel',
    className: 'detail_metrics_panel'
  });

  return MetricsDetailView;

});