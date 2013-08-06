define(function(require) {

  var BaseView = require('./BaseView'),
      debounce = require('mout/function/debounce'),
      d3 = require('d3'),
      nv = require('nv');
  require('rdust!templates/simple-line-graph');

  /**
   * Recent Orders View
   * @class app.ui.views.SimpleLineGraphView
   * @extends app.ui.views.BaseView
   */
  var SimpleLineGraphView = BaseView.extend(function() {
    BaseView.apply(this, arguments);

    var debouncedRedraw = debounce(_onChange.bind(this), 0);
    this.mapEvent({
      model: {
        addItem: debouncedRedraw,
        removeItem: debouncedRedraw,
        change: debouncedRedraw
      }
    });
    this.render();
  }, {
    /**
     * The name of the template used by the view
     * @property {String} template
     * @default 'example'
     */
    template: 'templates/simple-line-graph',
    /**
     * A class name added to the view container
     * @property {String} className
     * @default 'example'
     */
    className: 'simple-line-graph'

  });

  function _onChange() {
    if (!this.hasChart) {
      _createChart.call(this);
      this.hasChart = true;
    }
    
  }

  function _createChart() {
    var models = this.model.toObject().items;
    nv.addGraph(function() {
      var chart = nv.models.lineChart()
                   .x(function(d) { return d[0]; })
                   .y(function(d) { return d[1] / 100; })
                   .clipEdge(true);

      chart.xAxis
         .tickFormat(function(d) { return d3.time.format('%x')(new Date(d)); });

      chart.yAxis
         .tickFormat(d3.format(',.2f'));

      d3.select('#chart svg')
        .datum([{
          key: '',
          values: models.map(function(model) {
            return [
              model.modified,
              model.total
            ];
          })
        }])
        .transition().duration(500).call(chart);

      nv.utils.windowResize(chart.update);

      return chart;
    });
  }

  return SimpleLineGraphView;

});