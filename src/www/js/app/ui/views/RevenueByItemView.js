define(function(require) {

  var BaseChartView = require('./BaseChartView'),
      debounce = require('mout/function/debounce'),
      d3 = require('d3'),
      nv = require('nv');

  require('rdust!templates/revenue_by_item');

  /**
   * Renders a pie chart showing revenue
   * breakdown by item
   * @class app.ui.views.RevenueByItemView
   * @extends app.ui.views.BaseChartView
   */
  var RevenueByItemView = BaseChartView.extend(function RevenueByItemView() {
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
    template: 'templates/revenue_by_item',
    className: 'revenue_by_item',
    updateChart: function() {
      var data = this.getData(),
          selected = d3.select('.revenue_by_item svg');

      if (!data) {
        selected.text(null);
      }

      selected
          .datum(data)
        .transition().duration(500)
          .call(this.chart);
    },
    getData: function() {
      var data = [];
      this.model.each(function(index, model) {
        data.push({
          label: model.get('name'),
          value: model.get('total') / 100
        });
      });

      if (data.length) {
        return data;
      } else {
        return null;
      }
    },
    createChart: function() {
      return nv.models.pieChart()
              .x(function(d) { return d.label; })
              .y(function(d) { return d.value; })
              .showLabels(true)
              .labelThreshold(0.05)
              .donut(true);
    }
  });

  return RevenueByItemView;

});