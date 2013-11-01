define(function(require) {

  var BaseDataView = require('app/ui/BaseDataView');
  require('rdust!templates/order_metrics');

  /**
   * Recent Orders View
   * @class app.ui.metrics.OrderMetricsView
   * @extends app.ui.BaseDataView
   */
  var OrderMetricsView = BaseDataView.extend(function() {
    BaseDataView.apply(this, arguments);
  }, {
    template: 'templates/order_metrics',
    className: 'order_metrics',
    onChangeData: function() {
      this.redraw();
    }
  });

  return OrderMetricsView;

});