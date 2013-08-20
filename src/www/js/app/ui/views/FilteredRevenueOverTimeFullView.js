define(function(require) {

  var FilteredRevenueOverTimeView = require('./FilteredRevenueOverTimeView'),
      d3 = require('d3'),
      nv = require('nv'),
      moment = require('moment'),
      bucketData = require('app/misc/bucket_data'),
      timeRangeModel = require('app/models/TimeRangeModel');

  /**
   * Renders a smaller pie chart showing revenue
   * breakdown by category
   * @class app.ui.views.SmallRevenueByCategoryView
   * @extends app.ui.views.FilteredRevenueOverTimeView
   */

  var FilteredRevenueOverTimeFullView = FilteredRevenueOverTimeView.extend(function() {
    FilteredRevenueOverTimeView.apply(this, arguments);
    this.parentView.on('bar', this.updateChart.bind(this));
  }, {
    updateChart: function() {
      var selected = d3.select(this.el[0]).select('svg'),
          minTicks = 4,
          elWidth = this.el.width(),
          maxTicks = Math.round(elWidth / 20),
          rangeData = timeRangeModel.getRangeData(minTicks, maxTicks),
          values = [],
          max = 0,
          commaFormat = d3.format(',.2f'),
          filter,
          bucketedValues,
          data;
      // Reset background
      selected.select('#graph-background').remove();
      selected
        .insert('rect', '#area-gradient')
        .attr('id', 'graph-background')
        .attr('x', '0')
        .attr('y', '0')
        .attr('class', 'extent')
        .attr('height', '120')
        .attr('width', '110%');

      // Filter and bucket values
      if (this.parentView && this.parentView.model.filterCollectionItem) {
        filter = this.parentView.model.filterCollectionItem.bind(this.parentView.model);
      }
      bucketedValues = bucketData(this.model, rangeData.start, rangeData.end, rangeData.ticks, 'modified', 'total', filter),
      bucketedValues.forEach(function(bucketedVal, index) {
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

      // Find max and set y-scale
      this.model.each(function(index, model) {
        max = Math.max(model.get('total'), max);
      });
      this.chart.forceY([0, max]);

       this.chart.yAxis
        .tickPadding(4)
        .tickFormat(function(d) { return '$' + commaFormat(d/100); });

      this.chart.xAxis
        .tickFormat(function(millis) {
          var date = moment(millis);
          return date.format(rangeData.format);
        }.bind(this));
     

      selected
          .datum(data)
          .call(this.chart);

      setTimeout(function() {
        selected.selectAll('.nv-x .tick text')
          .attr('y', 10);
      }, 10);
      
    },
    createChart: function() {
      var chart = nv.models.discreteBarChart()
                    .x(function(d) { return d.label; })
                    .y(function(d) { return d.value; })
                    .tooltips(false)
                    .showValues(false)
                    .margin({top: 5, left: 97, right: 0, bottom: 50})
                    .color(function() {
                      return '#1ae08e';
                    })
                    .height(170);
      return chart;
    }

  });

  return FilteredRevenueOverTimeFullView;

});