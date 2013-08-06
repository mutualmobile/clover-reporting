define(function(require) {

  var BaseView = require('./BaseView'),
      nv = require('nv');

  require('rdust!templates/revenue_by_customer');

  /**
   * Super class for all chart views
   * @class app.ui.views.BaseChartView
   * @extends app.ui.views.BaseView
   */
  var BaseChartView = BaseView.extend(function BaseChartView() {
    BaseView.apply(this, arguments);

    this.chart = this.createChart();
    this.on('rendersuccess', this.onRenderSuccess);
    this.render();
  }, {
    template: 'templates/revenue_by_customer',
    className: 'revenue_by_customer',
    createChart: function() {},
    updateChart: function() {},
    getData: function() {},
    onRenderSuccess: function() {
      BaseView.prototype.onRenderSuccess.apply(this, arguments);
      nv.addGraph(function() {
        this.updateChart();
        return this.chart;
      }.bind(this));
    },
    dispose: function() {
      var chartIndex = nv.graphs.indexOf(this.chart);
      if (chartIndex > -1) {
        nv.graphs.splice(chartIndex, 1);
      }
      return BaseView.prototype.dispose.apply(this, arguments);
    }
  });

  return BaseChartView;

});