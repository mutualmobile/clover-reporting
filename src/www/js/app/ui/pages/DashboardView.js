define(function(require) {

  var BaseView = require('app/ui/BaseView'),
      Scrollable = require('lavaca/ui/Scrollable'),
      RevenueByCategoryView = require('app/ui/charts/pie/RevenueByCategoryView'),
      RevenueByCategoryModel = require('app/models/chart/RevenueByCategoryModel'),
      RevenueByDiningTypeModel = require('app/models/chart/RevenueByDiningTypeModel'),
      RevenueByEmployeeView = require('app/ui/charts/pie/RevenueByEmployeeView'),
      RevenueByDiningTypeView = require('app/ui/charts/pie/RevenueByDiningTypeView'),
      RevenueByEmployeeModel = require('app/models/chart/RevenueByEmployeeModel'),
      RevenueOverTimeView = require('app/ui/charts/time/RevenueOverTimeView'),
      RevenueOverTimeModel = require('app/models/chart/RevenueOverTimeModel'),
      OrderMetricsView = require('app/ui/metrics/OrderMetricsView'),
      OrderMetricsModel = require('app/models/metrics/OrderMetricsModel');

  require('rdust!templates/dashboard');

  /**
   * Dashboard View
   * @class app.ui.pages.DashboardView
   * @extends app.ui.BaseView
   */
  var DashboardView = BaseView.extend(function DashboardView() {
    BaseView.apply(this, arguments);
    this.mapWidget({
      'self': Scrollable
    });
    this.mapChildView({
      '.order-metrics': {
        TView: OrderMetricsView,
        model: new OrderMetricsModel()
      },
      '.revenue-graph': {
        TView: RevenueOverTimeView,
        model: new RevenueOverTimeModel()
      },
      '.revenue-by-category': {
        TView: RevenueByCategoryView,
        model: new RevenueByCategoryModel()
      },
      '.revenue-by-employee': {
        TView: RevenueByEmployeeView,
        model: new RevenueByEmployeeModel()
      }
      //To Be Added
      // '.revenue-by-dining-type': {
      //   TView: RevenueByDiningTypeView,
      //   model: new RevenueByDiningTypeModel()
      // }
    });
  }, {
    template: 'templates/dashboard',
    className: 'dashboard',
    trackerLabel: 'Dashboard'
  });

  return DashboardView;

});