define(function(require) {

  var BaseChartView = require('./BaseChartView'),
      debounce = require('mout/function/debounce'),
      d3 = require('d3'),
      nv = require('nv'),
      moment = require('moment');
  require('rdust!templates/revenue_over_time');

  /**
   * Recent Orders View
   * @class app.ui.views.RevenueOverTimeView
   * @extends app.ui.views.BaseChartView
   */
  var RevenueOverTimeView = BaseChartView.extend(function() {
    BaseChartView.apply(this, arguments);

    var debouncedChangeHandler = debounce(this.updateChart.bind(this), 0);
    this.mapEvent({
      model: {
        addItem: debouncedChangeHandler,
        removeItem: debouncedChangeHandler
      }
    });
    this.render();
  }, {
    /**
     * The name of the template used by the view
     * @property {String} template
     * @default 'example'
     */
    template: 'templates/revenue_over_time',
    /**
     * A class name added to the view container
     * @property {String} className
     * @default 'example'
     */
    className: 'revenue_over_time',
    updateChart: function() {
      d3.select('.revenue_over_time svg')
        .datum(this.getData())
        .transition().duration(500)
          .call(this.chart);
    },
    getData: function() {
      var models = this.model.toObject().items;
      return _getRevenueOverTimeByOrder.call(this, models);
    },
    createChart: function() {
      var chart = nv.models.lineChart()
        .x(function(d) { return d[0]; })
        .y(function(d) { return d[1] / 100; })
        .clipEdge(true);

      chart.xAxis
        .tickFormat(function(d) { return d3.time.format('%I:%M:%S %p')(new Date(d)); });

      chart.yAxis
        .tickFormat(d3.format(',.2f'));

      return chart;
    }

  });

  function _getRevenueOverTimeByOrder(models) {
    var total = 0;
      models.sort(function(a, b) {
        return a.modified - b.modified;
      });
      return [{
          key: 'Revenue',
          values: models.map(function(model) {
            return [
              model.modified,
              total += model.total
            ];
          })
        }];
  }

  return RevenueOverTimeView;

});