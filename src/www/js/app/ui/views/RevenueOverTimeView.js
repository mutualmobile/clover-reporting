define(function(require) {

  var BaseChartView = require('./BaseChartView'),
      debounce = require('mout/function/debounce'),
      d3 = require('d3'),
      nv = require('nv'),
      moment = require('moment');
  require('rdust!templates/revenue_over_time');


  var _DURATION_HASH = [{
          key: 'millisecond',
          duration: 1,
          format: 'SS'
        }, {
          key: 'second',
          duration: 1000,
          format: 'ss'
        }, {
          key: 'minute',
          duration: 1000 * 60,
          format: 'mm'
        }, {
          key: 'hour',
          duration: 1000 * 60 * 60,
          format: 'ha'
        }, {
          key: 'day',
          duration: 1000 * 60 * 60 * 24,
          format: 'DD'
        }, {
          key: 'month',
          duration: 1000 * 60 * 60 * 24 * 30,
          format: 'MM'
        }, {
          key: 'year',
          duration: 1000 * 60 * 60 * 24 * 365,
          format: 'YY'
        }
      ];

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
    template: 'templates/revenue_over_time',
    className: 'revenue_over_time',
    updateChart: function() {
      var start = this.model.get('startTime').clone(),
          end = this.model.get('endTime').clone(),
          startMillis = start.valueOf(),
          endMillis = end.valueOf(),
          totalDuration = endMillis - startMillis,
          minTicks = 4,
          maxTicks = Math.round(this.el.width() / 50),
          batchSize = 1,
          ticks = [],
          key,
          format,
          duration,
          currentTime,
          i;

      // Find appropriate units (minutes / hours / etc) based on minTicks
      for (i = 1; i < _DURATION_HASH.length; i++) {
        if (Math.ceil(totalDuration / _DURATION_HASH[i].duration) < minTicks) {
          break;
        }
      }
      i--;
      key = _DURATION_HASH[i].key;
      format = _DURATION_HASH[i].format;
      duration = _DURATION_HASH[i].duration;

      // Batch units as necessary (1 hour / 2 hours / etc) based on maxTicks
      while (Math.ceil(totalDuration / (duration * batchSize)) > maxTicks) {
        batchSize++;
      }

      // Round the start and end times to whole units
      start.startOf(key);
      end.startOf(key).add(key, 1);

      // Generate the intermediate ticks
      currentTime = start.clone();
      while (+(currentTime = currentTime.add(key, batchSize)) < endMillis) {
        ticks.push(currentTime.valueOf());
      }

      this.chart.forceX([start.valueOf(), end.valueOf()]);
      this.chart.xAxis
        .tickValues(ticks)
        .tickFormat(function(millis) {
          var date = moment(millis);
          return date.format(format);
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