define(function(require) {

  var BasePageView = require('./BasePageView'),
      Scrollable = require('lavaca/ui/Scrollable'),
      OrderMetricsView = require('app/ui/views/OrderMetricsView'),
      recentOrdersCollection = require('app/models/RecentOrdersCollection'),
      revenueByEmployeeCollection = require('app/models/RevenueByEmployeeCollection'),
      revenueByCategoryCollection = require('app/models/RevenueByCategoryCollection'),
      // mobileChartsModel = require('app/models/MobileChartsModel'),
      RevenueByCategoryView = require('app/ui/views/RevenueByCategoryView'),
      RevenueByEmployeeView = require('app/ui/views/RevenueByEmployeeView'),
      RevenueOverTimeView = require('app/ui/views/RevenueOverTimeView');
      // MobileChartsView = require('app/ui/views/MobileChartsView');

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
      // '.mobile-charts': {
      //   TView: MobileChartsView,
      //   model: mobileChartsModel
      // }
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