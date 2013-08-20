define(function(require) {

  var BaseChartView = require('./BaseChartView'),
      RevenueOverTimeView = require('./RevenueOverTimeView'),
      timeRangeModel = require('app/models/TimeRangeModel'),
      d3 = require('d3'),
      nv = require('nv');

  /**
   * Recent Orders View
   * @class app.ui.views.FilteredRevenueOverTimeView
   * @extends app.ui.views.BaseChartView
   */
  var FilteredRevenueOverTimeView = RevenueOverTimeView.extend(function FilteredRevenueOverTimeView() {
    RevenueOverTimeView.apply(this, arguments);
  }, {
    template: 'templates/revenue_over_time',
    className: 'small-revenue-over-time',
    onRenderSuccess: function() {
      return BaseChartView.prototype.onRenderSuccess.apply(this, arguments);
    },
    updateChart: function() {
      var selected = d3.select(this.el[0]).select('svg'),
          rangeData = timeRangeModel.getRangeData(4, 9),
          values = [],
          filter,
          bucketedValues,
          data;

      if (this.parentView) {
        filter = this.parentView.model.filterCollectionItem.bind(this.parentView.model);
      }

      bucketedValues = this.model.bucketData(rangeData.start, rangeData.end, rangeData.ticks, 'modified', 'total', filter),

      bucketedValues.forEach(function(bucketedVal, index) {
        values.push({
          label: 'Time ' + index, // Will be hidden, must be unique
          value: bucketedVal[1]
        });
      });

      data = [
        {
          key: 'Revenue',
          values: values
        }
      ];

      if (!data) {
        selected.text(null);
        this.el.addClass('empty');
      } else {
        this.el.removeClass('empty');
      }

      this.chart.forceY([0, 7]);

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
                    .showXAxis(false)
                    .margin({top: 5, left: 5, right: 5, bottom: 5})
                    .showYAxis(false)
                    .color(function() {
                      return '#1ae08e';
                    })
                    .width(126)
                    .height(59);
      return chart;
    }
  });

  return FilteredRevenueOverTimeView;

});