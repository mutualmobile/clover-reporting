define(function(require) {

  var FilteredRevenueOverTimeView = require('./FilteredRevenueOverTimeView'),
      d3 = require('d3'),
      nv = require('nv'),
      moment = require('moment'),
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
      var svg = d3.select(this.el[0]).select('svg'),
          minTicks = 4,
          elWidth = this.el.width(),
          maxTicks = Math.round(elWidth / 20),
          rangeData = timeRangeModel.getRangeData(minTicks, maxTicks),
          commanFormat = d3.format(',.2f');
      svg.select('#graph-background').remove();
      svg
        .insert('rect', '#area-gradient')
        .attr('id', 'graph-background')
        .attr('x', '0')
        .attr('y', '0')
        .attr('class', 'extent')
        .attr('height', '120')
        .attr('width', '110%');

      //this.chart.forceX([rangeData.start.valueOf(), rangeData.end.valueOf()]);
      this.chart.xAxis
        // .tickValues(rangeData.ticks)
        .tickFormat(function(millis) {
          var date = moment(millis);
          return date.format(rangeData.format);
        }.bind(this));
      this.chart.yAxis
        .tickPadding(4)
        .tickFormat(function(d) { return '$' + commanFormat(d); });
      FilteredRevenueOverTimeView.prototype.updateChart.apply(this, arguments);

      setTimeout(function() {
        svg.selectAll('.nv-x .tick text')
        .attr('y', 10);
      }, 100);
      
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