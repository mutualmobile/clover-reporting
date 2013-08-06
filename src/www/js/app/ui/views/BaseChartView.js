define(function(require) {

  var BaseView = require('./BaseView'),
      $ = require('jquery'),
      remove = require('mout/array/remove'),
      debounce = require('mout/function/debounce'),
      nv = require('nv');

  require('rdust!templates/revenue_by_customer');

  var _chartCache = [];
  $(window).on('resize.baseChart', debounce(function() {
    _chartCache.forEach(function(chart) {
      chart.update();
    });
  }, 50));

  /**
   * Super class for all chart views
   * @class app.ui.views.BaseChartView
   * @extends app.ui.views.BaseView
   */
  var BaseChartView = BaseView.extend(function BaseChartView() {
    BaseView.apply(this, arguments);

    this.chart = this.createChart();
    _chartCache.push(this.chart);
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
      remove(nv.graphs, this.chart);
      remove(_chartCache, this.chart);
      return BaseView.prototype.dispose.apply(this, arguments);
    }
  });

  return BaseChartView;

});