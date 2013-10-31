define(function(require) {

  var RevenueByCategoryView = require('app/ui/charts/pie/RevenueByCategoryView');

  /**
   * Renders a smaller pie chart showing revenue
   * breakdown by category
   * @class app.ui.charts.pie.SmallRevenueByCategoryView
   * @extends app.ui.charts.pie.RevenueByCategoryView
   */

  var SmallRevenueByCategoryView = RevenueByCategoryView.extend({
    createChart: function() {
      var chart = RevenueByCategoryView.prototype.createChart.apply(this,arguments);
      chart
        .arcRadius(28)
        .showLabels(false);
      return chart;
    }

  });

  return SmallRevenueByCategoryView;

});