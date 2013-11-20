define(function(require) {

  var BaseChartView = require('app/ui/charts/BaseChartView'),
      batchCalls = require('app/misc/batch_calls'),
      d3 = require('d3'),
      nv = require('nv'),
      $ = require('$'),
      colors = require('app/misc/color_scheme'),
      tracker = require('app/analytics/tracker');
  require('app/ui/widgets/CustomPieChart');
  require('rdust!templates/base_pie');

  /**
   * Renders a pie chart
   * @class app.ui.charts.pie.BasePieChartView
   * @extends app.ui.charts.BaseChartView
   */
  var BasePieChartView = BaseChartView.extend(function BasePieChartView() {
    BaseChartView.apply(this, arguments);

    this.mapEvent({
      '.popover': {
        'tap': _tapInPopover,
        'mouseenter': _enterPopover,
        'mouseleave': _exitPopover.bind(this)
      },
      '.pie-center': {
        'tap': _tapInCircle.bind(this),
        'mouseenter': _enterCircle.bind(this),
        'mouseleave': _exitCircle.bind(this)
      },
      '.popover-see-more': {
        'tap': this.onTapSeeMore.bind(this)
      }
    });

    this.updateLegend = batchCalls(_redrawLegend, this);
  }, {
    template: 'templates/base_pie',
    className: 'base_pie',
    updateChart: function() {
      var data = this.model.get('pieData'),
          selected = d3.select(this.el[0]).select('svg');

      if (!data || data.length === 0) {
        selected.text(null);
        this.el.addClass('empty');
      } else {
        this.el.removeClass('empty');
      }

      selected
          .datum(data)
        .transition().duration(500)
          .call(this.chart);

      this.updateLegend();
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
              .labelType('custom1')
              .color(function(d, i) {
                return colors[i % colors.length];
              });

      return chart;
    },
    onTapSeeMore: function(e) {
      e.stopPropagation();
      e.preventDefault();
      tracker.trackEvent('Dashboard_TopCharts', 'ClickThrough', this.trackerLabel);
    }
  });

  var _inPopover = false,
      _inCircle = false;
  function _tapInCircle(e) {
    $('.base_pie .popover').hide();
    _showPopover.call(this);
    e.stopPropagation();
  }

  function _enterCircle() {
    _inCircle = true;
    _showPopover.call(this);
  }

  function _exitCircle() {
    _inCircle = false;
    _hidePopover.call(this);
  }

  function _enterPopover() {
    _inPopover = true;
  }

  function _exitPopover() {
    _inPopover = false;
    _hidePopover.call(this);
  }

  function _tapInPopover(e) {
    e.stopPropagation();
  }

  function _showPopover() {
    this.el.find('.popover').show();
    tracker.trackEvent('Dashboard_TopCharts', 'DataDrillDown', this.trackerLabel);
  }

  function _hidePopover() {
    setTimeout(function() {
      if (!_inPopover && !_inCircle) {
        this.el.find('.popover').hide();
      }
    }.bind(this), 0);
  }

  function _redrawLegend() {
    this.redraw('.legend');
  }

  $(function() {
    $('body').on('tap.pieChartPopover', {showHighlight: false}, function() {
      $('.base_pie .popover').hide();
    });
  });

  return BasePieChartView;

});