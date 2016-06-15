define(function(require) {

  var PopoverControlView = require('app/ui/navigation/PopoverControlView'),
      timeRangeModel = require('app/models/global/TimeRangeModel'),
      clone = require('mout/lang/clone'),
      tracker = require('app/analytics/tracker'),
      $ = require('$');
  require('rdust!templates/mode_menu');

  /**
   * Renders a pie chart showing revenue
   * breakdown by employee
   * @class app.ui.navigation.ModeMenuView
   * @extends app.ui.navigation.PopoverControlView
   */
  var ModeMenuView = PopoverControlView.extend(function ModeMenuView() {
    PopoverControlView.apply(this, arguments);
    this.mapEvent({
      li: {
        tap: _onChangeRangeSelect.bind(this)
      }
    });
    this.model.timeRange = clone(timeRangeModel.toObject());
  }, {
    template: 'templates/mode_menu',
    className: 'mode_menu'
  });

  function _onChangeRangeSelect(e) {
    var newMode = $(e.currentTarget).attr('data-value'),
        currentViewLabel = tracker.getCurrentPageLabel();
    e.stopPropagation();
    timeRangeModel.set('mode', newMode);
    tracker.trackEvent(currentViewLabel + '_DateFilter', 'ChangeDateFilter', newMode);
  }

  return ModeMenuView;

});