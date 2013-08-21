define(function(require) {

  var BaseChartView = require('./BaseChartView'),
      debounce = require('mout/function/debounce'),
      Translation = require('lavaca/util/Translation'),
      router = require('lavaca/mvc/Router'),
      d3 = require('d3'),
      nv = require('nv'),
      moment = require('moment'),
      bucketData = require('app/misc/bucket_data'),
      timeRangeModel = require('app/models/TimeRangeModel'),
      $ = require('jquery');
  require('app/ui/widgets/CustomLineChart');
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
        'dataChange': debouncedChangeHandler,
        'change.startTime': debouncedChangeHandler,
        'change.endTime': debouncedChangeHandler
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
        var svg = d3.select(this.el[0]).select('svg');
        svg.append('svg:defs');
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
      }.bind(this), 0);
    },
    updateChart: function() {
      var minTicks = 4,
          elWidth = this.el.width(),
          maxTicks = Math.round(elWidth / 20),
          rangeData = timeRangeModel.getRangeData(minTicks, maxTicks),
          maxHeight,
          data;
      // Remove tooldtips
      nv.tooltip.cleanup();

      this.key = rangeData.key;

      this.chart.forceX([rangeData.start.valueOf(), rangeData.end.valueOf()]);
      this.chart.xAxis
        .axisLabel(Translation.get('chart_axis.' + rangeData.key) || 'Time')
        .tickValues(rangeData.ticks)
        .tickFormat(function(millis) {
          var date = moment(millis);
          return date.format(rangeData.format);
        }.bind(this));
      this.chart.yAxis
        .tickFormat(d3.format('$,.2f'));
      // Get Data
      data =[{
        area: true,
        key: 'Revenue',
        values: bucketData(this.model, rangeData.start, rangeData.end, rangeData.ticks, 'modified', 'total')
      }];
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
        .attr('dy', ((elWidth / (rangeData.ticks.length + 1)) / 2) - 2 +'px')
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