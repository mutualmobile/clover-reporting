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
    var debouncedRedraw = debounce(_onChange.bind(this), 0);
    this.mapEvent({
      model: {
        addItem: debouncedRedraw,
        removeItem: debouncedRedraw
      }
    });
    this.chart = _getChart();
    this.on('rendersuccess', _onRenderSuccess);
    this.on('redrawsuccess', _onRenderSuccess);
    this.render();
  }, {
    template: 'templates/revenue_by_customer',
    className: 'revenue_by_customer'
  });

  function _onChange() {
    this.redraw();
  }

  function _onRenderSuccess() {
    if (this.model.count()) {
      nv.addGraph(function() {
        var chart = _getChart();

        d3.select('.revenue_by_customer svg')
            .datum(_getData.call(this))
          .transition().duration(500)
            .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
      }.bind(this));
    }
  }

  // Private functions
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
  var _chart;
  function _getChart() {
    if (!_chart) {
      _chart = nv.models.discreteBarChart()
        .x(function(d) { return d.label; })
        .y(function(d) { return d.value; })
        .staggerLabels(true)
        .tooltips(false)
        .showValues(true);
    }
    return _chart;
  }

  return RevenueByCustomerView;

});