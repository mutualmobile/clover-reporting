define(function(require) {

  var BasePageView = require('./BasePageView'),
      debounce = require('mout/function/debounce');

  require('rdust!templates/recent_orders');

  /**
   * Recent Orders View
   * @class app.ui.views.RecentOrdersView
   * @extends app.ui.views.BasePageView
   */
  var RecentOrdersView = BasePageView.extend(function() {
    BasePageView.apply(this, arguments);

    var debouncedModelChange = debounce(_onModelChange.bind(this), 0);
    this.mapEvent({
      model: {
        addItem: debouncedModelChange,
        removeItem: debouncedModelChange
      }
    });
  }, {
    /**
     * The name of the template used by the view
     * @property {String} template
     * @default 'example'
     */
    template: 'templates/recent_orders',
    /**
     * A class name added to the view container
     * @property {String} className
     * @default 'example'
     */
    className: 'recent_orders'

  });

  function _onModelChange() {
    this.redraw();
  }

  return RecentOrdersView;

});