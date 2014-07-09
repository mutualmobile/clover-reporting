define(function(require) {
  var BasePieChartView = require('app/ui/charts/pie/BasePieChartView'),
      PieChartPopoverView = require('app/ui/charts/pie/detail/PieChartPopoverView'),
      router = require('lavaca/mvc/Router');
  require('rdust!templates/revenue_by_dining_type');

  var RevenueByDiningTypeView = BasePieChartView.extend(function RevenueByDiningTypeView() {
    BasePieChartView.apply(this, arguments);
    this.mapChildView({
      '.popover': {
        TView: PieChartPopoverView
      }
    });
  }, {
    template: 'templates/revenue_by_dining_type',
    className: 'base_pie revenue_by_dining_type',
    trackerLabel: 'TopDiningType',
    onTapSeeMore: function() {
      BasePieChartView.prototype.onTapSeeMore.apply(this, arguments);
      router.exec('/dining-type');
    }
  });

  return RevenueByDiningTypeView;
});