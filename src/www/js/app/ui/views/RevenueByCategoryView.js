define(function(require) {

  var BasePieChartView = require('./BasePieChartView');
  require('app/ui/widgets/CustomPieChart');
  require('rdust!templates/revenue_by_item');

  /**
   * Renders a pie chart showing revenue
   * breakdown by category
   * @class app.ui.views.RevenueByCategoryView
   * @extends app.ui.views.BasePieChartView
   */
  var RevenueByCategoryView = BasePieChartView.extend(function RevenueByCategoryView() {
    BasePieChartView.apply(this, arguments);
    this.render();
  }, {
    template: 'templates/revenue_by_item',
    className: 'revenue_by_item',
    d3ChartSelector: '.revenue_by_item svg',
    getData: function() {
      var data = [];
      this.model.each(function(index, model) {
        data.push({
          label: model.get('name'),
          value: model.get('total') / 100
        });
      });

      data.sort(function(a, b) {
        return b.value - a.value;
      });

      if (data.length) {
        return data;
      } else {
        return null;
      }
    },
    createChart: function() {
      var colors = ['#afa728', '#984b29', '#2e9a59', '#2777b0'],
          chart = BasePieChartView.prototype.createChart.apply(this, arguments);
      chart.color(function(d, i) {
        return colors[i % colors.length];
      });
      return chart;
    }
  });

  return RevenueByCategoryView;

});