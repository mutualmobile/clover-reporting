define(function(require) {

  var BaseView = require('./BaseView'),
      debounce = require('mout/function/debounce'),
      d3 = require('d3'),
      nv = require('nv');

  require('rdust!templates/revenue_by_customer');

  /**
   * Renders a bar chart showing revenue
   * breakdown by customer
   * @class app.ui.views.RevenueByCustomerView
   * @extends app.ui.views.BaseView
   */
  var RevenueByCustomerView = BaseView.extend(function RevenueByCustomerView() {
    BaseView.apply(this, arguments);

    var debouncedChangeHandler = debounce(_updateChart.bind(this), 0);
    this.mapEvent({
      model: {
        addItem: debouncedChangeHandler,
        removeItem: debouncedChangeHandler
      }
    });
    this.chart = _createChart();
    this.on('rendersuccess', _onRenderSuccess);
    this.render();
  }, {
    template: 'templates/revenue_by_customer',
    className: 'revenue_by_customer',
    dispose: function() {
      var chartIndex = nv.graphs.indexOf(this.chart);
      if (chartIndex > -1) {
        nv.graphs.splice(chartIndex, 1);
      }
      return BaseView.prototype.dispose.apply(this, arguments);
    }
  });

  // Event listeners
  function _onRenderSuccess() {
    nv.addGraph(function() {
      _updateChart.call(this);
      return this.chart;
    }.bind(this));
  }

  // Private functions
  function _updateChart() {
    d3.select('.revenue_by_customer svg')
        .datum(_getData.call(this))
      .transition().duration(500)
        .call(this.chart);
  }

  function _getData() {
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
    return [data];
  }

  // Utility functions
  function _createChart() {
    var chart = nv.models.discreteBarChart()
        .x(function(d) { return d.label; })
        .y(function(d) { return d.value; })
        .staggerLabels(true)
        .tooltips(false)
        .showValues(true);
    return chart;
  }

  return RevenueByCustomerView;

});