define(function(require) {

  var BaseView = require('./BaseView'),
      debounce = require('mout/function/debounce');
  require('rdust!templates/pie_popover');

  /**
   * Renders a pie chart
   * @class app.ui.views.PieChartPopoverView
   * @extends app.ui.views.BaseView
   */
  var PieChartPopoverView = BaseView.extend(function PieChartPopoverView() {
    BaseView.apply(this, arguments);

    var debouncedChangeHandler = debounce(_redraw.bind(this), 0);
    this.mapEvent({
      'self': {
        'mouseenter': _mouseEnter.bind(this),
        'mouseleave': _mouseLeave.bind(this)
      },
      model: {
        addItem: debouncedChangeHandler,
        removeItem: debouncedChangeHandler,
        'change.loading': debouncedChangeHandler
      }
    });
    this.render();
  }, {
    template: 'templates/pie_popover',
    className: 'pie_popover',
    spinnerArgs: {
      color: '#000'
    }
  });

  function _redraw() {
    this.redraw();
  }

  function _mouseEnter(e) {

  }

  function _mouseLeave(e) {
    
  }

  return PieChartPopoverView;

});