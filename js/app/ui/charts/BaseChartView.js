define(function(require) {

  var BaseDataView = require('app/ui/BaseDataView'),
      $ = require('$'),
      remove = require('mout/array/remove'),
      debounce = require('mout/function/debounce'),
      nv = require('nv');

  require('rdust!templates/revenue_by_customer');

  /**
   * Super class for all chart views
   * @class app.ui.charts.BaseChartView
   * @extends app.ui.BaseDataView
   */
  var BaseChartView = BaseDataView.extend(function BaseChartView() {
    BaseDataView.apply(this, arguments);

    this.chart = this.createChart();
    $(window).on('resize.baseChart'+this.id, debounce(function() {
      this.updateChart();
    }.bind(this), 50));
  }, {
    template: 'templates/revenue_by_customer',
    className: 'revenue_by_customer',
    createChart: function() {},
    updateChart: function() {},
    onDataChange: function() {
      this.updateChart();
    },
    onRenderSuccess: function() {
      BaseDataView.prototype.onRenderSuccess.apply(this, arguments);
      nv.addGraph(function() {
        if (this.model) {
          this.updateChart();
        }
        return this.chart;
      }.bind(this));
    },
    dispose: function() {
      $(window).off('resize.baseChart'+this.id);
      remove(nv.graphs, this.chart);
      return BaseDataView.prototype.dispose.apply(this, arguments);
    }
  });

  return BaseChartView;

});