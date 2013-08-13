define(function(require) {

  var BasePieChartView = require('./BasePieChartView');
  require('rdust!templates/revenue_by_employee');

  /**
   * Renders a pie chart showing revenue
   * breakdown by employee
   * @class app.ui.views.RevenueByEmployeeView
   * @extends app.ui.views.BasePieChartView
   */
  var RevenueByEmployeeView = BasePieChartView.extend(function RevenueByEmployeeView() {
    BasePieChartView.apply(this, arguments);
    this.render();
  }, {
    template: 'templates/revenue_by_employee',
    className: 'base_pie revenue_by_employee',
    d3ChartSelector: '.revenue_by_employee svg',
    getData: function() {
      var totals = {},
          data = [];

      this.model.each(function(index, model) {
        var employeeName = model.get('employeeName');
        if (employeeName) {
          if (!totals[employeeName]) {
            totals[employeeName] = {
              label: employeeName,
              value: 0
            };
          }
          totals[employeeName].value += model.get('total');
        }
      });

      for (var employee in totals) {
        data.push(totals[employee]);
      }

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

  return RevenueByEmployeeView;

});