define(function(require) {

  var BaseView = require('app/ui/BaseView'),
      Scrollable = require('lavaca/ui/Scrollable'),
      OrderMetricsView = require('app/ui/metrics/OrderMetricsView'),
      recentOrdersCollection = require('app/models/RecentOrdersCollection'),
      revenueByEmployeeCollection = require('app/models/RevenueByEmployeeCollection'),
      revenueByCategoryCollection = require('app/models/RevenueByCategoryCollection'),
      RevenueByCategoryView = require('app/ui/charts/pie/RevenueByCategoryView'),
      RevenueByEmployeeView = require('app/ui/charts/pie/RevenueByEmployeeView'),
      RevenueOverTimeView = require('app/ui/charts/chronological/RevenueOverTimeView');

  require('rdust!templates/dashboard');

  /**
   * Dashboard View
   * @class app.ui.pages.DashboardView
   * @extends app.ui.BaseView
   */
  var DashboardView = BaseView.extend(function() {
    BaseView.apply(this, arguments);
    this.mapWidget({
      'self': Scrollable
    });
    this.mapChildView({
      '.order-metrics': {
        TView: OrderMetricsView,
        model: recentOrdersCollection
      },
      '.revenue-graph': {
        TView: RevenueOverTimeView,
        model: recentOrdersCollection
      },
      '.revenue-by-category': {
        TView: RevenueByCategoryView,
        model: revenueByCategoryCollection
      },
      '.revenue-by-employee': {
        TView: RevenueByEmployeeView,
        model: revenueByEmployeeCollection
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