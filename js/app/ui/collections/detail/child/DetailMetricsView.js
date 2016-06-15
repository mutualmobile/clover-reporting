define(function(require) {
  var BaseDataView = require('app/ui/BaseDataView'),
      batchCalls = require('app/misc/batch_calls');
  require('rdust!templates/detail_metrics');

  var DetailMetricsView = BaseDataView.extend(function DetailMetricsView() {
    BaseDataView.apply(this, arguments);

    this.mapEvent({
      model: {
        change: batchCalls(_onModelChange, this)
      }
    });
  }, {
    template: 'templates/detail_metrics'
  });

  function _onModelChange() {
    this.redraw();
  }

  return DetailMetricsView;
});