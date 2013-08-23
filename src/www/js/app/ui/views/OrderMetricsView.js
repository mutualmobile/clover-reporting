define(function(require) {

  var BaseView = require('./BaseView'),
      debounce = require('app/misc/debounce');

  require('rdust!templates/order_metrics');

  /**
   * Recent Orders View
   * @class app.ui.views.OrderMetricsView
   * @extends app.ui.views.BaseView
   */
  var OrderMetricsView = BaseView.extend(function() {
    BaseView.apply(this, arguments);
    var debouncedRedraw = debounce(_onChange, this, 0);
    this.mapEvent({
      model: {
        addItem: debouncedRedraw,
        removeItem: debouncedRedraw,
        dataChange: debouncedRedraw,
        change: debouncedRedraw
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