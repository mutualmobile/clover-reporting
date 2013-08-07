define(function(require) {

  var BasePageView = require('./BasePageView'),
      Scrollable = require('lavaca/ui/Scrollable'),
      RecentOrdersView = require('app/ui/views/RecentOrdersView'),
      recentOrdersCollection = require('app/models/RecentOrdersCollection'),
      RevenueByCustomerView = require('app/ui/views/RevenueByCustomerView'),
      RevenueOverTimeView = require('app/ui/views/RevenueOverTimeView');

  require('rdust!templates/dashboard');

  /**
   * Dashboard View
   * @class app.ui.pageviews.DashboardView
   * @extends app.ui.pageviews.BasePageView
   */
  var DashboardView = BasePageView.extend(function() {
    BasePageView.apply(this, arguments);
    this.mapWidget({
      'self': Scrollable
    });
    this.mapChildView({
      '.widget-0': {
        TView: RecentOrdersView,
        model: recentOrdersCollection
      },
      '.widget-1': {
        TView: RevenueOverTimeView,
        model: recentOrdersCollection
      },
      '.widget-2': {
        TView: RevenueByCustomerView,
        model: recentOrdersCollection
      },
      '.widget-3': {
        TView: RecentOrdersView,
        model: recentOrdersCollection
      }
    });
  }, {
    /**
     * The name of the template used by the view
     * @property {String} template
     * @default 'example'
     */
    template: 'templates/dashboard',
    /**
     * A class name added to the view container
     * @property {String} className
     * @default 'example'
     */
    className: 'dashboard'

  });

  return DashboardView;

});