define(function(require) {
  var BaseDataView = require('app/ui/BaseDataView');
  require('rdust!templates/pie_popover');

  /**
   * Renders a pie chart
   * @class app.ui.charts.pie.detail.PieChartPopoverView
   * @extends app.ui.BaseDataView
   */
  var PieChartPopoverView = BaseDataView.extend(function PieChartPopoverView() {
    BaseDataView.apply(this, arguments);
  }, {
    template: 'templates/pie_popover',
    className: 'pie_popover',
    onDataChange: function() {
      this.redraw();
    },
    spinnerArgs: {
      color: '#000'
    }
  });

  return PieChartPopoverView;
});