define(function(require) {

  var BasePieChartView = require('./BasePieChartView'),
      PieChartPopoverView = require('./PieChartPopoverView');
  require('rdust!templates/revenue_by_employee');

  /**
   * Renders a pie chart showing revenue
   * breakdown by employee
   * @class app.ui.views.RevenueByEmployeeView
   * @extends app.ui.views.BasePieChartView
   */
  var RevenueByEmployeeView = BasePieChartView.extend(function RevenueByEmployeeView() {
    BasePieChartView.apply(this, arguments);
    this.mapChildView({
      '.popover': {
        TView: PieChartPopoverView
      }
    });
    this.render();
  }, {
    template: 'templates/revenue_by_employee',
    className: 'base_pie revenue_by_employee',
    getData: function() {
      var data = this.model.toObject();

      if (data.items.length) {
        return data.items;
      } else {
        return null;
      }
    },
    createChart: function() {
      var colors = ['#af4f25', '#b79e16', '#2e9a59', '#2569af', '#cf1077', '#25adaf', '#700eaf'],
          chart = BasePieChartView.prototype.createChart.apply(this, arguments);
      chart.color(function(d, i) {
        return colors[i % colors.length];
      });
      return chart;
    },
    onTapSeeMore: function(e) {
      // e.stopPropagation();
      // e.preventDefault();
    }
  });

  return RevenueByEmployeeView;

});