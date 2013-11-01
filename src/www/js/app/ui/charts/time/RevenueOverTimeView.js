define(function(require) {

  var BaseChartView = require('app/ui/charts/BaseChartView'),
      Translation = require('lavaca/util/Translation'),
      d3 = require('d3'),
      nv = require('nv'),
      moment = require('moment'),
      bucketData = require('app/misc/bucket_data'),
      timeRangeModel = require('app/models/global/TimeRangeModel');
  require('app/ui/widgets/CustomLineChart');
  require('rdust!templates/revenue_over_time');

  /**
   * Recent Orders View
   * @class app.ui.charts.chronological.RevenueOverTimeView
   * @extends app.ui.charts.BaseChartView
   */
  var RevenueOverTimeView = BaseChartView.extend(function() {
    BaseChartView.apply(this, arguments);
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
          .insert('image')
          .attr('xlink:href', '/assets/img/graphshadow_top.png')
          .attr('id', 'graph-bottom-shadow')
          .attr('x', '0')
          .attr('y', '192')
          .attr('class', 'extent')
          .attr('preserveAspectRatio', 'defer none')
          .attr('height', '108')
          .attr('width', '100%');
      }.bind(this), 0);
    },
    updateChart: function() {
      var minTicks = 4,
          elWidth = this.el.width(),
          maxTicks = Math.round(elWidth / 30),
          rangeData,
          maxHeight,
          data;
      // Remove tooltips
      nv.tooltip.cleanup();

      if (!elWidth) { return; }

      rangeData = timeRangeModel.getRangeData(minTicks, maxTicks);

      // Used in the tooltip content function
      this.rangeData = rangeData;

      this.chart.forceX([rangeData.start.valueOf(), rangeData.end.valueOf()]);
      this.chart.xAxis
        .axisLabel(Translation.get('chart_axis.' + rangeData.key) || 'Time')
        .tickValues(rangeData.ticks)
        .tickFormat(function(millis) {
          return moment(millis).format(rangeData.format);
        }.bind(this));
      this.chart.yAxis
        .tickFormat(d3.format('$,.2f'));

      // Get Data
      data =[{
        area: true,
        key: 'Revenue',
        values: bucketData(this.model.get('data'), rangeData.start, rangeData.end, rangeData.ticks, 'modified', 'total')
      }];
      // Calcuate range for yAxis
      maxHeight = 0;
      data[0].values.forEach(function(item) {
        if (item[1] > maxHeight) {
          maxHeight = item[1];
        }
      });
      maxHeight = (maxHeight/100) * 2;
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
            .y(function(d) { return d[1] / 100; }),
          tooltipFormats = {
            'day': 'MMM DD',
            'hour': 'h:mm'
          };
      chart.tooltipContent(function(key, x, y, e) {
        var start = moment(this.rangeData.ticks[e.pointIndex-1] || this.rangeData.start),
            end =  moment((this.rangeData.ticks[e.pointIndex] || this.rangeData.end) - 1),
            format = tooltipFormats[this.rangeData.key] || this.rangeData.format,
            startString = start.format(format),
            endString = end.format(format),
            label = startString === endString ? startString : startString + ' - ' + endString,
            content;
        content = '<time>' + label + '</time>' +
              '<div class="money">' + y + '</div><div class="triangle"></div>';
        return content;
      }.bind(this));

      return chart;
    }

  });

  return RevenueOverTimeView;

});