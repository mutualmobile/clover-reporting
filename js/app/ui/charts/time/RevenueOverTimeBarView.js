define(function(require) {
  var BaseChartView = require('app/ui/charts/BaseChartView'),
      RevenueOverTimeView = require('app/ui/charts/time/RevenueOverTimeView'),
      timeRangeModel = require('app/models/global/TimeRangeModel'),
      bucketData = require('app/misc/bucket_data'),
      d3 = require('d3'),
      nv = require('nv'),
      moment = require('moment');

  var RevenueOverTimeBarView = RevenueOverTimeView.extend(function RevenueOverTimeBarView() {
    RevenueOverTimeView.apply(this, arguments);
  }, {
    template: 'templates/revenue_over_time',
    className: 'small-revenue-over-time',
    minDataRange: 4,
    maxDataRange: 9,
    onRenderSuccess: function() {
      return BaseChartView.prototype.onRenderSuccess.apply(this, arguments);
    },
    updateChart: function() {
      var selected = d3.select(this.el[0]).select('svg'),
          rangeData = timeRangeModel.getRangeData(this.minDataRange, this.maxDataRange),
          values = [],
          commaFormat = d3.format(',.2f'),
          filter,
          bucketedValues,
          data;

      if (!this.model) {return;}
      bucketedValues = bucketData(this.model.get('data'), rangeData.start, rangeData.end, rangeData.ticks, 'modified', 'total', filter),
      bucketedValues.forEach(function(bucketedVal) {
        values.push({
          label: bucketedVal[0], // Will be hidden, must be unique
          value: bucketedVal[1]
        });
      });
      data = [
        {
          key: 'Revenue',
          values: values
        }
      ];
      if (!data[0].values.length) {
        selected.text(null);
        this.el.addClass('empty');
      } else {
        this.el.removeClass('empty');
      }

      this.chart.yAxis
        .tickPadding(20)
        .tickSubdivide(1)
        .tickFormat(function(d) { return '$' + commaFormat(d/100); });

      this.chart.xAxis
        .tickPadding(10)
        .tickFormat(function(millis) {
          var date = moment(millis);
          return date.format(rangeData.format);
        }.bind(this));

      selected
          .datum(data)
          .call(this.chart);
    },
    createChart: function() {
      var chart = nv.models.discreteBarChart()
                    .x(function(d) { return d.label; })
                    .y(function(d) { return d.value; })
                    .tooltips(false)
                    .showValues(false)
                    .margin({top: 50, left: 80, right: 20, bottom: 50})
                    .color(function() {
                      return '#1ae08e';
                    })
                    .height(180);
      return chart;
    }
  });

  return RevenueOverTimeBarView;
});