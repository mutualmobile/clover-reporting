define(function(require) {
  var BasePieChartView = require('app/ui/charts/pie/BasePieChartView');

  var SmallPieChartView = BasePieChartView.extend(function SmallPieChartView() {
    BasePieChartView.apply(this, arguments);
  }, {
    createChart: function() {
      var chart = BasePieChartView.prototype.createChart.apply(this, arguments);
      chart
        .arcRadius(28)
        .showLabels(false);
      return chart;
    }
  });

  return SmallPieChartView;
});