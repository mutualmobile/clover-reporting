define(function(require) {

  var BasePieChartView = require('app/ui/charts/pie/BasePieChartView'),
      PieChartPopoverView = require('app/ui/charts/pie/detail/PieChartPopoverView'),
      colors = require('app/misc/color_scheme'),
      router = require('lavaca/mvc/Router');
  require('rdust!templates/revenue_by_employee');

  /**
   * Renders a pie chart showing revenue
   * breakdown by employee
   * @class app.ui.charts.pie.RevenueByEmployeeView
   * @extends app.ui.charts.pie.BasePieChartView
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
    handleOther: function(data) {
      return data; // Don't group small items into 'other'
    },
    getData: function() {
      var data = this.model.toObject();

      if (data.items.length) {
        return data.items;
      } else {
        return null;
      }
    },
    createChart: function() {
      var chart = BasePieChartView.prototype.createChart.apply(this, arguments);
      chart.color(function(d, i) {
        return colors[i % colors.length];
      });
      return chart;
    },
    onTapSeeMore: function(e) {
      e.stopPropagation();
      e.preventDefault();
      router.exec('/employees');
    }
  });

  return RevenueByEmployeeView;

});