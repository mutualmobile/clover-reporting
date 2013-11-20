define(function(require) {

  var BaseView = require('app/ui/BaseView'),
      $ = require('$'),
      PageMenuView = require('app/ui/navigation/PageMenuView'),
      ModeMenuView = require('app/ui/navigation/ModeMenuView'),
      stateModel = require('app/models/global/StateModel'),
      tracker = require('app/analytics/tracker');

  require('rdust!templates/time_selector');

  /**
   * Time selector view
   * @class app.ui.navigation.TimeSelectorView
   * @extends app.ui.BaseView
   */
  var TimeSelectorView = BaseView.extend(function TimeSelectorView() {
    BaseView.apply(this, arguments);
    this.mapChildView({
      '#pagemenu': {
        TView: PageMenuView,
        model: stateModel
      },
      '#time-range-select': {
        TView: ModeMenuView,
        model: {}
      }
    });
    this.mapEvent({
      '.date-range .forward': {
        tap: _onTapForward.bind(this)
      },
      '.date-range .back': {
        tap: _onTapBack.bind(this)
      },
      'model': {
        'rangeUpdate': _onChangeModel.bind(this)
      }
    });
    this._hideHeaderChangeHandler = _onChangeHidden.bind(this);
    stateModel.on('change', 'hideHeader', this._hideHeaderChangeHandler);
    _onChangeHidden.call(this);
    this.render();
  }, {
    template: 'templates/time_selector',
    className: 'time_selector',
    dispose: function() {
      stateModel.off('change', this._hideHeaderChangeHandler);
      return BaseView.prototype.dispose.apply(this, arguments);
    }
  });

  // Event handlers

  function _onChangeModel(e) {
    if (e.changeMode) {
      this.redraw();
    } else {
      this.redraw('time');
    }
  }

  function _onTapForward() {
    _advanceTimeRange.call(this, 'add');
  }

  function _onTapBack() {
    _advanceTimeRange.call(this, 'subtract');
  }

  function _onChangeHidden() {
    $(document.body).toggleClass('hide-header', stateModel.get('hideHeader'));
  }

  // Private functions

  function _advanceTimeRange(operation) {
    var start = this.model.get('startTime').clone(),
        mode = this.model.get('mode'),
        newStart = start[operation](mode, 1),
        newEnd = newStart.clone().endOf(mode),
        currentViewLabel = tracker.getCurrentPageLabel();
    this.model.setCustomTimeRange(newStart, newEnd);
    tracker.trackEvent(currentViewLabel + '_DateChange', 'DateChange');
  }


  return TimeSelectorView;

});