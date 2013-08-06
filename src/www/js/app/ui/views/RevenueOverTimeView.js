define(function(require) {

  var BaseView = require('./BaseView'),
      debounce = require('mout/function/debounce'),
      d3 = require('d3'),
      nv = require('nv');
  require('rdust!templates/revenue_over_time');

  /**
   * Recent Orders View
   * @class app.ui.views.RevenueOverTimeView
   * @extends app.ui.views.BaseView
   */
  var RevenueOverTimeView = BaseView.extend(function() {
    BaseView.apply(this, arguments);

    var debouncedRedraw = debounce(_updateChart.bind(this), 0);
    this.mapEvent({
      model: {
        addItem: debouncedRedraw,
        removeItem: debouncedRedraw,
        change: debouncedRedraw
      }
    });
    this.on('rendersuccess', _onRenderSuccess.bind(this));
    this.chart = _createChart();
    this.render();
  }, {
    /**
     * The name of the template used by the view
     * @property {String} template
     * @default 'example'
     */
    template: 'templates/revenue_over_time',
    /**
     * A class name added to the view container
     * @property {String} className
     * @default 'example'
     */
    className: 'revenue_over_time'

  });

  function _onRenderSuccess() {
    nv.addGraph(function() {
      _updateChart.call(this);
      return this.chart;
    }.bind(this));
  }

  function _updateChart() {
    d3.select('.revenue_over_time svg')
      .datum(_getData.call(this))
      .transition().duration(500).call(this.chart);
  }

  function _getData() {
    var models = this.model.toObject().items;
    var total = 0;
    models.sort(function(a, b) {
      return a.modified > b.modified;
    });
    return [{
        key: 'Revenue',
        values: models.map(function(model) {
          return [
            model.modified,
            total += model.total
          ];
        })
      }];
  }

  function _createChart() {
    var chart = nv.models.stackedAreaChart()
     .x(function(d) { return d[0]; })
     .y(function(d) { return d[1] / 100; })
     .clipEdge(true);
    chart.xAxis
       .tickFormat(function(d) { return d3.time.format('%I:%M:%S %p')(new Date(d)); });

    chart.yAxis
       .tickFormat(d3.format(',.2f'));

    return chart;
  }

  return RevenueOverTimeView;

});