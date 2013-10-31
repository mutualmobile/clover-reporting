define(function(require) {
  var BasePieChartView = require('app/ui/charts/pie/BasePieChartView'),
      PieChartPopoverView = require('app/ui/charts/pie/detail/PieChartPopoverView'),
      RevenueByItemModel = require('app/models/RevenueByItemModel'),
      router = require('lavaca/mvc/Router');
  require('rdust!templates/revenue_by_category');

  var RevenueByCategoryView = BasePieChartView.extend(function RevenueByCategoryView() {
    BasePieChartView.apply(this, arguments);
    this.mapChildView({
      '.popover': {
        TView: PieChartPopoverView,
        model: new RevenueByItemModel()
      }
    });
  }, {
    template: 'templates/revenue_by_category',
    className: 'base_pie revenue_by_category',
    onTapSeeMore: function(e) {
      e.stopPropagation();
      e.preventDefault();
      router.exec('/products');
    }
  });

  return RevenueByCategoryView;
});