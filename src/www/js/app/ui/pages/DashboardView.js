define(function(require) {

  var BaseView = require('app/ui/BaseView'),
      Scrollable = require('lavaca/ui/Scrollable'),
      // OrderMetricsView = require('app/ui/metrics/OrderMetricsView'),
      // recentOrdersCollection = require('app/models_old/RecentOrdersCollection'),
      // revenueByEmployeeCollection = require('app/models_old/RevenueByEmployeeCollection'),
      // revenueByCategoryCollection = require('app/models_old/RevenueByCategoryCollection'),
      // RevenueByCategoryView = require('app/ui/charts/pie/RevenueByCategoryView'),
      // RevenueByEmployeeView = require('app/ui/charts/pie/RevenueByEmployeeView'),
      // RevenueOverTimeView = require('app/ui/charts/chronological/RevenueOverTimeView');
      RevenueByCategoryView = require('app/ui/charts/pie/RevenueByCategoryView'),
      RevenueByCategoryModel = require('app/models/RevenueByCategoryModel'),
      RevenueByEmployeeView = require('app/ui/charts/pie/RevenueByEmployeeView'),
      RevenueByEmployeeModel = require('app/models/RevenueByEmployeeModel');

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
      // '.order-metrics': {
      //   TView: OrderMetricsView,
      //   model: recentOrdersCollection
      // },
      // '.revenue-graph': {
      //   TView: RevenueOverTimeView,
      //   model: recentOrdersCollection
      // },
      '.revenue-by-category': {
        TView: RevenueByCategoryView,
        model: new RevenueByCategoryModel()
      },
      '.revenue-by-employee': {
        TView: RevenueByEmployeeView,
        model: new RevenueByEmployeeModel()
      }
    });
  }, {
    template: 'templates/dashboard',
    className: 'dashboard'
  });

  return DashboardView;

});