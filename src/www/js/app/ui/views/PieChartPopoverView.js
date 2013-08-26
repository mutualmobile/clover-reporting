define(function(require) {

  var BaseView = require('./BaseView'),
      batchCalls = require('app/misc/batch_calls');
  require('rdust!templates/pie_popover');

  /**
   * Renders a pie chart
   * @class app.ui.views.PieChartPopoverView
   * @extends app.ui.views.BaseView
   */
  var PieChartPopoverView = BaseView.extend(function PieChartPopoverView() {
    BaseView.apply(this, arguments);

    var batchedChangeHandler = batchCalls(_redraw, this);
    this.mapEvent({
      model: {
        addItem: batchedChangeHandler,
        removeItem: batchedChangeHandler,
        dataChange: batchedChangeHandler,
        'change.loading': batchedChangeHandler
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

  return PieChartPopoverView;

});