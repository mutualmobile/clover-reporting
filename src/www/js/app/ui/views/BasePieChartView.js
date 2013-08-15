define(function(require) {

  var BaseChartView = require('./BaseChartView'),
      debounce = require('mout/function/debounce'),
      d3 = require('d3'),
      nv = require('nv'),
      $ = require('jquery');
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
      '.see-more': {
        'tap': this.onTapSeeMore.bind(this)
      },
      model: {
        'addItem': debouncedChangeHandler,
        'removeItem': debouncedChangeHandler
        // 'change.startTime': debouncedChangeHandler,
        // 'change.endTime': debouncedChangeHandler
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
    },
    onTapSeeMore: function(e) {
      e.stopPropagation();
      e.preventDefault();
    }
  });

  var _inPopover = false,
      _inCircle = false;
  function _tapInCircle(e) {
    $('.base_pie .popover').hide();
    this.el.find('.popover').show();
    e.stopPropagation();
  }

  function _enterCircle() {
    _inCircle = true;
    this.el.find('.popover').show();
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

  function _hidePopover() {
    setTimeout(function() {
      if (!_inPopover && !_inCircle) {
        this.el.find('.popover').hide();
      }
    }.bind(this), 0);
  }

  $(function() {
    $('body').on('tap.pieChartPopover', function() {
      $('.base_pie .popover').hide();
    });
  });

  return BasePieChartView;

});