define(function(require) {

  var BasePieChartView = require('app/ui/charts/pie/BasePieChartView'),
      PieChartPopoverView = require('app/ui/charts/pie/detail/PieChartPopoverView'),
      revenueByItemCollection = require('app/models_old/RevenueByItemCollection'),
      colors = require('app/misc/color_scheme'),
      router = require('lavaca/mvc/Router');
  require('rdust!templates/revenue_by_category');

  /**
   * Renders a pie chart showing revenue
   * breakdown by category
   * @class app.ui.charts.pie.RevenueByCategoryView
   * @extends app.ui.charts.pie.BasePieChartView
   */
  var RevenueByCategoryView = BasePieChartView.extend(function RevenueByCategoryView() {
    BasePieChartView.apply(this, arguments);
    this.mapChildView({
      '.popover': {
        TView: PieChartPopoverView,
        model: revenueByItemCollection
      }
    });
  }, {
    template: 'templates/revenue_by_category',
    className: 'base_pie revenue_by_category',
    getData: function() {
      var data = [];
      this.model.each(function(index, model) {
        data.push({
          label: model.get('name'),
          value: model.get('total') / 100
        });
      });

      data.sort(function(a, b) {
        return a.label.localeCompare(b.label);
      });

      if (data.length) {
        return data;
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
      router.exec('/products');
    }
  });

  return RevenueByCategoryView;

});