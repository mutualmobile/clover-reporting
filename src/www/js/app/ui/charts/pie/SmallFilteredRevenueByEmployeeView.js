define(function(require) {

  var FilteredRevenueByEmployeeView = require('app/ui/charts/pie/FilteredRevenueByEmployeeView');

  /**
   * Renders a pie chart showing revenue
   * breakdown by employee
   * @class app.ui.charts.pie.SmallFilteredRevenueByEmployeeView
   * @extends app.ui.charts.pie.FilteredRevenueByEmployeeView
   */
  var SmallFilteredRevenueByEmployeeView = FilteredRevenueByEmployeeView.extend(function SmallFilteredRevenueByEmployeeView() {
    FilteredRevenueByEmployeeView.apply(this, arguments);
  }, {
    createChart: function() {
      var chart = FilteredRevenueByEmployeeView.prototype.createChart.apply(this, arguments);
      chart
        .arcRadius(28)
        .showLabels(false);
      return chart;
    }
  });

  return SmallFilteredRevenueByEmployeeView;

});