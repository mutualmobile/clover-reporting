define(function(require) {
  var DetailView = require('./DetailView'),
      Collection = require('lavaca/mvc/Collection'),
      FilteredRevenueOverTimeView = require('app/ui/views/FilteredRevenueOverTimeView'),
      FilteredRevenueOverTimeFullView = require('app/ui/views/FilteredRevenueOverTimeFullView'),
      SmallFilteredRevenueByEmployeeView = require('app/ui/views/SmallFilteredRevenueByEmployeeView'),
      FilteredRevenueByEmployeeView = require('app/ui/views/FilteredRevenueByEmployeeView'),
      MetricsDetailView = require('app/ui/views/MetricsDetailView');

  require('rdust!templates/detail');

  /**
   * Employee Detail View
   * @class app.ui.views.EmployeeDetailView
   * @extends app.ui.views.DetailView
   */
  var EmployeeDetailView = DetailView.extend(function() {
    DetailView.apply(this, arguments);
    var employeesCollection = new Collection(this.model.get('employees')),
        ordersCollection = new Collection(this.model.get('orders'));
    this.mapChildView({
      '.revenue-by-category': {
        TView: SmallFilteredRevenueByEmployeeView,
        model: employeesCollection
      },
      '.bar-chart .inner': {
        TView: FilteredRevenueOverTimeView,
        model: ordersCollection
      },
      '.bar-chart-full': {
        TView: FilteredRevenueOverTimeFullView,
        model: ordersCollection
      },
      '.metrics': {
        TView: MetricsDetailView
      },
      '.pie-detail': {
        TView: FilteredRevenueByEmployeeView,
        model: employeesCollection
      }
    });
    this.render();
  });

  return EmployeeDetailView;

});