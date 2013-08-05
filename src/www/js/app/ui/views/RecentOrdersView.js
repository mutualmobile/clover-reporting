define(function(require) {

  var BaseView = require('./BaseView'),
      debounce = require('mout/function/debounce');

  require('rdust!templates/recent_orders');

  /**
   * Recent Orders View
   * @class app.ui.views.RecentOrdersView
   * @extends app.ui.views.BaseView
   */
  var RecentOrdersView = BaseView.extend(function() {
    BaseView.apply(this, arguments);

    var debouncedRedraw = debounce(_onChange.bind(this), 0);
    this.mapEvent({
      model: {
        addItem: debouncedRedraw,
        removeItem: debouncedRedraw,
        change: debouncedRedraw
      }
    });
    this.render();
  }, {
    template: 'templates/recent_orders',
    className: 'recent_orders'

  });

  function _onChange() {
    this.redraw();
  }

  return RecentOrdersView;

});