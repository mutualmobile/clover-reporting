define(function(require) {
  var BasePieChartView = require('app/ui/charts/pie/BasePieChartView'),
      router = require('lavaca/mvc/Router');

  var RevenueByCategoryView = BasePieChartView.extend(function RevenueByCategoryView() {
    BasePieChartView.apply(this, arguments);
    // this.mapChildView({
    //   '.popover': {
    //     TView: PieChartPopoverView,
    //     model: revenueByItemCollection
    //   }
    // });
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