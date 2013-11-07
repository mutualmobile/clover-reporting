define(function(require) {
  var RevenueByEmployeeView = require('app/ui/charts/pie/RevenueByEmployeeView');

  var SmallRevenueByEmployeeView = RevenueByEmployeeView.extend(function SmallRevenueByEmployeeView() {
    RevenueByEmployeeView.apply(this, arguments);
  }, {
    createChart: function() {
      var chart = RevenueByEmployeeView.prototype.createChart.apply(this, arguments);
      chart
        .arcRadius(28)
        .showLabels(false);
      return chart;
    }
  });

  return SmallRevenueByEmployeeView;
});