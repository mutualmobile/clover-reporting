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
        removeItem: debouncedChangeHandler,
        'change.startTime': debouncedChangeHandler,
        'change.endTime': debouncedChangeHandler
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
      var start = this.model.get('startTime').valueOf(),
          end = this.model.get('endTime').valueOf(),
          range = end - start,
          maxTicks = 12,
          xDiff = Math.round(range / (maxTicks - 1)),
          tickInterval = [];

      this.chart.forceX([start, end]);

      for (var i = 0; i < maxTicks - 1; i++){
        tickInterval.push(start + (i * xDiff));
      }
      tickInterval.push(end);

      this.chart.xAxis
        .tickValues(tickInterval)
        .tickFormat(function(d) {
          var date = moment(d);
          if (range <= (1000 * 60 * 60 * 24)) { // 24 hours
            return date.format('HH');
          } else {
            return date.format('DD');
          }
        });

      this.chart.yAxis
        .tickFormat(d3.format('$,.2f'));

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