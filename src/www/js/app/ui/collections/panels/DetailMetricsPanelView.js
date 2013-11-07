define(function(require) {
  var BaseDataView = require('app/ui/BaseDataView');

  var DetailMetricsPanelView = BaseDataView.extend(function DetailMetricsPanelView() {
    BaseDataView.apply(this, arguments);
  });

  return DetailMetricsPanelView;
});