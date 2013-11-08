define(function(require) {
  var BaseDataView = require('app/ui/BaseDataView'),
      batchCalls = require('app/misc/batch_calls');
  require('rdust!templates/detail_metrics_panel');

  var DetailMetricsPanelView = BaseDataView.extend(function DetailMetricsPanelView() {
    BaseDataView.apply(this, arguments);
    this.mapEvent({
      model: {
        change: batchCalls(_onModelChange, this)
      }
    });
  }, {
    template: 'templates/detail_metrics_panel',
    className: 'detail_metrics_panel'
  });

  function _onModelChange() {
    this.redraw();
  }

  return DetailMetricsPanelView;
});