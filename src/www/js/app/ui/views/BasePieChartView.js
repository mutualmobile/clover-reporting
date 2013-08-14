define(function(require) {

  var BaseChartView = require('./BaseChartView'),
      debounce = require('mout/function/debounce'),
      d3 = require('d3'),
      nv = require('nv');
  require('app/ui/widgets/CustomPieChart');
  require('rdust!templates/base_pie');

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
    template: 'templates/base_pie',
    className: 'base_pie',
    updateChart: function() {
      var data = this.getData(),
          selected = d3.select(this.d3ChartSelector);

      if (!data) {
        selected.text(null);
        this.el.addClass('empty');
      } else {
        this.el.removeClass('empty');
      }

      selected
          .datum(this.handleOther(data))
        .transition().duration(500)
          .call(this.chart);
    },
    getData: function() {},
    handleOther: function(data) {
      var total = 0,
          cutoff = 0.062,
          newData = [],
          other = {
            label: 'Other',
            value: 0
          };

      if (!data) { return data; }

      // Calculate total
      data.forEach(function(item) {
        total += item.value;
      });

      // Determine the cutoff (data should already be in descending order)
      for (var i = data.length - 1; i >= 0; i--) {
        if ((data[i].value / total) < cutoff) {
          other.value += data[i].value;
        } else {
          newData.unshift(data[i]);
        }
      }

      // Add other to data if necessary
      if (other.value) {
        newData.push(other);
      }

      return newData;
    },
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