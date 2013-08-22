define(function(require) {

  var PopoverControlView = require('app/ui/controls/PopoverControlView'),
      timeRangeModel = require('app/models/TimeRangeModel'),
      clone = require('mout/lang/clone'),
      $ = require('$');
  require('rdust!templates/mode_menu');

  /**
   * Renders a pie chart showing revenue
   * breakdown by employee
   * @class app.ui.views.ModeMenuView
   * @extends app.ui.controls.PopoverControlView
   */
  var ModeMenuView = PopoverControlView.extend(function ModeMenuView() {
    PopoverControlView.apply(this, arguments);
    this.mapEvent({
      li: {
        touchstart: function(e) {e.stopPropagation();},
        tap: _onChangeRangeSelect.bind(this)
      }
    });
    this.model.timeRange = clone(timeRangeModel.toObject());
    this.render();
  }, {
    template: 'templates/mode_menu',
    className: 'mode_menu'
  });

  function _onChangeRangeSelect(e) {
    e.stopPropagation();
    timeRangeModel.set('mode', $(e.currentTarget).data('value'));
  }

  return ModeMenuView;

});