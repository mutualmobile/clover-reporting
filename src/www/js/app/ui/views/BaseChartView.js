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
    this.mapEvent({
      model: {
        'change.loading': _onChangeLoading.bind(this)
      }
    });
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

  function _onChangeLoading(e) {
    var loading = e.value;
    if (!loading) {
      d3.select('.loading').classed('loading', false);
      this.el.find('.loading-spinner').remove();
    }
  }

  return BaseChartView;

});