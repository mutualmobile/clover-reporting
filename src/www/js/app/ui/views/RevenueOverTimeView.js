define(function(require) {

  var BaseChartView = require('./BaseChartView'),
      debounce = require('mout/function/debounce'),
      Translation = require('lavaca/util/Translation'),
      d3 = require('d3'),
      nv = require('nv'),
      moment = require('moment');
  require('app/ui/widgets/CustomLineChart');
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
    onRenderSuccess: function() {
      BaseChartView.prototype.onRenderSuccess.apply(this, arguments);
      setTimeout(function() {
        d3.select('svg .nv-lineChart > g')
          .insert('rect', '.nv-linesWrap')
          .attr('id', 'graph-background')
          .attr('x', '-1')
          .attr('class', 'extent')
          .attr('height', '186')
          .attr('width', '110%');
      }, 0);
    },
    updateChart: function() {
      var start = this.model.get('startTime').clone(),
          end = this.model.get('endTime').clone(),
          startMillis = start.valueOf(),
          endMillis = end.valueOf(),
          totalDuration = endMillis - startMillis,
          minTicks = 4,
          elWidth = this.el.width(),
          maxTicks = Math.round(elWidth / 50),
          batchSize = 1,
          ticks = [],
          key,
          format,
          duration,
          currentTime,
          i,
          maxHeight,
          data;

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
        .axisLabel(Translation.get('chart_axis.' + key) || 'Time')
        .tickValues(ticks)
        .tickFormat(function(millis) {
          var date = moment(millis);
          return date.format(format);
        });
      this.chart.yAxis
        .tickFormat(d3.format('$,.2f'));
      // Get Data
      data = this.getData(ticks, start, end.valueOf());
      // Calcuate range for yAxis
      maxHeight = 0;
      data[0].values.forEach(function(item) {
        if (item[1] > maxHeight) {
          maxHeight = item[1];
        }
      });
      maxHeight = (maxHeight/100);
      maxHeight = maxHeight + (maxHeight * 0.2);
      this.chart.forceY([0, maxHeight || 1]);

      d3.select('.revenue_over_time svg')
        .datum(data)
        .transition().duration(500)
          .call(this.chart);

      d3.selectAll('.revenue_over_time svg .nv-x .tick text, .revenue_over_time svg .nv-x .nv-axisMaxMin text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', (elWidth / (ticks.length + 1)) / 2 +'px')
        .attr('transform', function() {
            return 'rotate(-90)' ;
        });
      d3.selectAll('.revenue_over_time svg .nv-x .tick line') 
        .attr('x1', '0')
        .attr('y1', '40');
    },
    getData: function(ticks, start, end) {
      ticks.unshift(start.valueOf());
      var models = this.model.toObject().items;
      return _getRevenueOverTimeByOrder.call(this, models, ticks, end);
    },
    createChart: function() {
      var chart = nv.models.customLineChart()
            .x(function(d) { return d[0]; })
            .y(function(d) { return d[1] / 100; });
      chart.tooltipContent(function(key, x, y, e, graph) {
        return '<time>' + moment(e.point[0]).format('MMMM DD') + '</time>' +
              '<div class="money">$' + parseFloat(y, 10).toFixed(2) + '</div><div class="triangle"></div>';
      });

      return chart;
    }

  });

  function _getRevenueOverTimeByOrder(models, ticks, end) {
    var buckets = [];

    ticks.forEach(function(tick, i) {
      buckets.push([
        tick + (((ticks[i+1] || end) - tick) / 2),
        0
      ]);
    });
    models.forEach(function(model) {
      ticks.some(function(tick, i) {
        if (model.modified > tick && model.modified < (ticks[i+1] || end)) {
          buckets[i][1] += model.total;
        }
      });
    });

    return [{
      area: true,
      key: 'Revenue',
      values: buckets
    }];

  }

  return RevenueOverTimeView;

});