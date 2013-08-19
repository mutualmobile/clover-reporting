define(function(require) {

  var RevenueByCategoryView = require('./RevenueByCategoryView');

  /**
   * Renders a smaller pie chart showing revenue
   * breakdown by category
   * @class app.ui.views.SmallRevenueByCategoryView
   * @extends app.ui.views.RevenueByCategoryView
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