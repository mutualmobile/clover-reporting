define(function(require) {
  var BaseView = require('./BaseView');
  require('rdust!templates/metrics_detail');

  /**
   * Employee Detail View
   * @class app.ui.views.MetricsDetailView
   * @extends app.ui.views.BaseView
   */
  var MetricsDetailView = BaseView.extend(function MetricsDetailView() {
    BaseView.apply(this, arguments);
    this.render();
  }, {
    template: 'templates/metrics_detail',
    className: 'metrics_detail'
  });

  return MetricsDetailView;

});