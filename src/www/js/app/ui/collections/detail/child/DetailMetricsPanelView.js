define(function(require) {
  var BaseDataView = require('app/ui/BaseDataView');
  require('rdust!templates/detail_metrics_panel');

  var DetailMetricsPanelView = BaseDataView.extend(function DetailMetricsPanelView() {
    BaseDataView.apply(this, arguments);
  }, {
    template: 'templates/detail_metrics_panel',
    className: 'detail_metrics_panel'
  });

  return DetailMetricsPanelView;
});