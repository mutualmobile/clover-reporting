define(function(require) {
  var BaseDataView = require('app/ui/BaseDataView');
  require('rdust!templates/detail_metrics');

  var DetailMetricsView = BaseDataView.extend(function DetailMetricsView() {
    BaseDataView.apply(this, arguments);
    this.mapEvent({
      model: {
        change: function() {
          this.redraw();
        }.bind(this)
      }
    });
  }, {
    template: 'templates/detail_metrics'
  });

  return DetailMetricsView;
});