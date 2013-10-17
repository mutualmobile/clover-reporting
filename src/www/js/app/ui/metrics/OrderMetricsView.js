define(function(require) {

  var BaseView = require('app/ui/BaseView'),
      batchCalls = require('app/misc/batch_calls');

  require('rdust!templates/order_metrics');

  /**
   * Recent Orders View
   * @class app.ui.metrics.OrderMetricsView
   * @extends app.ui.BaseView
   */
  var OrderMetricsView = BaseView.extend(function() {
    BaseView.apply(this, arguments);
    var batchedRedraw = batchCalls(_onChange, this);
    this.mapEvent({
      model: {
        addItem: batchedRedraw,
        removeItem: batchedRedraw,
        dataChange: batchedRedraw,
        change: batchedRedraw
      }
    });
    this.render();
  }, {
    template: 'templates/order_metrics',
    className: 'order_metrics'

  });

  function _onChange() {
    this.redraw();
  }

  return OrderMetricsView;

});