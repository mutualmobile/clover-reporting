define(function(require) {

  var BaseView = require('./BaseView');

  require('rdust!templates/bar_chart');

  /**
   * Bar Chart View
   * @class app.ui.views.BarChartView
   * @extends app.ui.views.BaseView
   */
  var BarChartView = BaseView.extend(function() {
    BaseView.apply(this, arguments);
    this.render();
  }, {
    template: 'templates/bar_chart',
    className: 'bar_chart'
  });

  return BarChartView;

});