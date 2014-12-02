define(function(require) {
  var BasePieChartView = require('app/ui/charts/pie/BasePieChartView'),
      PieChartPopoverView = require('app/ui/charts/pie/detail/PieChartPopoverView'),
      RevenueByItemModel = require('app/models/chart/RevenueByItemModel'),
      router = require('lavaca/mvc/Router');
  require('rdust!templates/revenue_by_category');

  var RevenueByItemView = BasePieChartView.extend(function RevenueByItemView() {
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
    trackerLabel: 'TopItems',
    onTapSeeMore: function() {
      BasePieChartView.prototype.onTapSeeMore.apply(this, arguments);
      router.exec('/items');
    }
  });

  return RevenueByItemView;
});