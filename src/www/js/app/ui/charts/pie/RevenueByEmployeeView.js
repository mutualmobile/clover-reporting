define(function(require) {
  var BasePieChartView = require('app/ui/charts/pie/BasePieChartView'),
      PieChartPopoverView = require('app/ui/charts/pie/detail/PieChartPopoverView'),
      router = require('lavaca/mvc/Router');
  require('rdust!templates/revenue_by_employee');

  var RevenueByEmployeeView = BasePieChartView.extend(function RevenueByEmployeeView() {
    BasePieChartView.apply(this, arguments);
    this.mapChildView({
      '.popover': {
        TView: PieChartPopoverView
      }
    });
  }, {
    template: 'templates/revenue_by_employee',
    className: 'base_pie revenue_by_employee',
    onTapSeeMore: function(e) {
      e.stopPropagation();
      e.preventDefault();
      router.exec('/employees');
    }
  });

  return RevenueByEmployeeView;
});