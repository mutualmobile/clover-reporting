define(function(require) {

  var BaseChartView = require('./BaseChartView'),
      debounce = require('mout/function/debounce'),
      Translation = require('lavaca/util/Translation'),
      router = require('lavaca/mvc/Router'),
      d3 = require('d3'),
      nv = require('nv'),
      moment = require('moment'),
      timeRangeModel = require('app/models/TimeRangeModel'),
      $ = require('jquery');
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
        removeItem: debouncedChangeHandler
      },
      '.nvtooltip .button': {
        'tap': _onTapTooltipButton.bind(this)
      }
    });
    this.render();
  }, {
    template: 'templates/revenue_over_time',
    className: 'revenue_over_time',
    onRenderSuccess: function() {
      BaseChartView.prototype.onRenderSuccess.apply(this, arguments);
      setTimeout(function() {
        var svg = d3.select('svg'),
            defs = svg.append('svg:defs');
        d3.select('svg .nv-lineChart > g')
          .insert('rect', '.nv-linesWrap')
          .attr('id', 'graph-background')
          .attr('x', '-1')
          .attr('y', '0')
          .attr('class', 'extent')
          .attr('height', '192')
          .attr('width', '110%');
        svg
          .insert('image', '.nv-lineChart')
          .attr('xlink:href', '/assets/img/graphshadow_top.png')
          .attr('id', 'graph-bottom-shadow')
          .attr('x', '0')
          .attr('y', '192')
          .attr('class', 'extent')
          .attr('height', '108')
          .attr('width', '100%');
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
          maxTicks = Math.round(elWidth / 20),
          batchSize = 1,
          ticks = [],
          currentTime,
          i,
          maxHeight,
          data;
      // Remove tooldtips
      nv.tooltip.cleanup();
      // Find appropriate units (minutes / hours / etc) based on minTicks
      for (i = 1; i < _DURATION_HASH.length; i++) {
        if (Math.ceil(totalDuration / _DURATION_HASH[i].duration) < minTicks) {
          break;
        }
      }
      i--;
      this.key = _DURATION_HASH[i].key;
      this.format = _DURATION_HASH[i].format;
      this.duration = _DURATION_HASH[i].duration;

      // Batch units as necessary (1 hour / 2 hours / etc) based on maxTicks
      while (Math.ceil(totalDuration / (this.duration * batchSize)) > maxTicks) {
        batchSize++;
      }

      // Round the start and end times to whole units
      start.startOf(this.key);
      end.startOf(this.key).add(this.key, 1);

      // Generate the intermediate ticks
      currentTime = start.clone();
      while (+(currentTime = currentTime.add(this.key, batchSize)) < endMillis) {
        ticks.push(currentTime.valueOf());
      }
      this.chart.forceX([start.valueOf(), end.valueOf()]);
      this.chart.xAxis
        .axisLabel(Translation.get('chart_axis.' + this.key) || 'Time')
        .tickValues(ticks)
        .tickFormat(function(millis) {
          var date = moment(millis);
          return date.format(this.format);
        }.bind(this));
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
          .call(this.chart);

      d3.selectAll('.revenue_over_time svg .nv-x .tick text, .revenue_over_time svg .nv-x .nv-axisMaxMin text')
        .style('text-anchor', 'end')
        .attr('dx', '-25')
        .attr('dy', ((elWidth / (ticks.length + 1)) / 2) - 2 +'px')
        .attr('transform', function() {
            return 'rotate(-90)' ;
        });
      d3.selectAll('.revenue_over_time svg .nv-x .tick > line:first-child') 
        .attr('x1', '0')
        .attr('y1', '64');
      d3.selectAll('.revenue_over_time svg .nv-x .tick')[0].forEach(function(item) {
        d3.select(item)
          .insert('line')
          .attr('x1', '-1')
          .attr('y1', '64')
          .attr('x2', '-1')
          .attr('y2', '0')
          .style('stroke', 'rgba(0,0,0,.2)');
      });
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
        var time = moment(e.point[0]),
            content,
            hideButton,
            start,
            end;
        if (this.key === 'day') {
          start = time.clone().startOf('day');
          end = time.clone().endOf('day');
        } else {
          hideButton = true;
        }
        content = '<time>' + time.format('MMMM DD') + '</time>' +
              '<div class="money">$' + parseFloat(y, 10).toFixed(2) + '</div><div class="triangle"></div>';
        if (!hideButton) {
          content += '<div class="button" data-start="'+ start +'" data-end="'+ end +'">View</div>';
        }
        return content;
      }.bind(this));

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

  function _onTapTooltipButton(e) {
    var el = $(e.currentTarget);
    timeRangeModel.set('mode', 'day');
    router.exec('/zoom', null, {
      startTime: el.data('start'),
      endTime: el.data('end')
    });
  }

  return RevenueOverTimeView;

});