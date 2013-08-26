define(function(require) {

  var BaseChartView = require('./BaseChartView'),
      batchCalls = require('app/misc/batch_calls'),
      d3 = require('d3'),
      nv = require('nv');

  require('rdust!templates/revenue_by_customer');

  /**
   * Renders a bar chart showing revenue
   * breakdown by customer
   * @class app.ui.views.RevenueByCustomerView
   * @extends app.ui.views.BaseChartView
   */
  var RevenueByCustomerView = BaseChartView.extend(function RevenueByCustomerView() {
    BaseChartView.apply(this, arguments);

    var batchedChangeHandler = batchCalls(this.updateChart, this);
    this.mapEvent({
      model: {
        addItem: batchedChangeHandler,
        removeItem: batchedChangeHandler,
        dataChange: batchedChangeHandler
      }
    });
    this.render();
  }, {
    template: 'templates/revenue_by_customer',
    className: 'revenue_by_customer',
    updateChart: function() {
      var data = this.getData(),
          selected = d3.select('.revenue_by_customer svg');

      if (!data) {
        selected.text(null);
      }
      selected
          .datum(data)
        .transition().duration(500)
          .call(this.chart);
    },
    getData: function() {
      var data = {
            key: 'Revenue By Customer',
            values: []
          },
          totals = {};
      this.model.each(function(index, model) {
        var customer = model.get('customer'),
            name = 'Anonymous';
        if (customer) {
          name = customer.firstName + ' ' + customer.lastName;
        }
        totals[name] = (totals[name] || 0) + (model.get('total') / 100);
      });

      for (var name in totals) {
        data.values.push({
          label: name,
          value: totals[name]
        });
      }
      data.values.sort(function(a, b) {
        return a.value - b.value;
      });
      if (data.values.length) {
        return [data];
      } else {
        return null;
      }
    },
    createChart: function() {
      return nv.models.discreteBarChart()
            .x(function(d) { return d.label; })
            .y(function(d) { return d.value; })
            .staggerLabels(true)
            .tooltips(false)
            .showValues(true);
    }
  });

  return RevenueByCustomerView;

});