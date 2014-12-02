define(function(require) {

  var BaseView = require('app/ui/BaseView'),
      Scrollable = require('lavaca/ui/Scrollable'),
      RevenueByItemView = require('app/ui/charts/pie/RevenueByItemView'),
      RevenueByItemModel = require('app/models/chart/RevenueByItemModel'),
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
      '.revenue-by-item': {
        TView: RevenueByItemView,
        model: new RevenueByItemModel()
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