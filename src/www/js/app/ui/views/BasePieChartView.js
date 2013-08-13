define(function(require) {

  var BaseChartView = require('./BaseChartView'),
      debounce = require('mout/function/debounce'),
      d3 = require('d3'),
      nv = require('nv');
  require('app/ui/widgets/CustomPieChart');
  require('rdust!templates/revenue_by_item');

  /**
   * Renders a pie chart
   * @class app.ui.views.BasePieChartView
   * @extends app.ui.views.BaseChartView
   */
  var BasePieChartView = BaseChartView.extend(function BasePieChartView() {
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
  }, {
    updateChart: function() {
      var data = this.getData(),
          selected = d3.select(this.d3ChartSelector);

      if (!data) {
        selected.text(null);
      }

      selected
          .datum(data)
        .transition().duration(500)
          .call(this.chart);
    },
    getData: function() {},
    createChart: function() {
      var chart = nv.models.pieChart()
              .x(function(d) { return d.label; })
              .y(function(d) { return d.value; })
              .showLabels(true)
              .showLegend(false)
              .labelThreshold(0.062)
              .donut(true)
              .donutRatio(1)
              .donutLabelsOutside(true)
              .spacing(0.07)
              .labelOffset(30)
              .tooltips(false)
              .labelType('custom1');

      return chart;
    }
  });

  return BasePieChartView;

});