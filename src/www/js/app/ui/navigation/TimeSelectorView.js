define(function(require) {

  var BaseView = require('app/ui/BaseView'),
      $ = require('$'),
      router = require('lavaca/mvc/Router'),
      PageMenuView = require('app/ui/navigation/PageMenuView'),
      ModeMenuView = require('app/ui/navigation/ModeMenuView'),
      stateModel = require('app/models/global/StateModel');

  require('rdust!templates/time_selector');

  /**
   * Time selector view
   * @class app.ui.navigation.TimeSelectorView
   * @extends app.ui.BaseView
   */
  var TimeSelectorView = BaseView.extend(function() {
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

  function _onChangeModel() {
    this.redraw();
  }

  function _onTapForward() {
    var start = this.model.get('startTime'),
        mode = this.model.get('mode'),
        newStart = start.add(mode, 1);
    router.exec('/zoom', null, {startTime: newStart.valueOf(), endTime: newStart.endOf(mode).valueOf()});
  }

  function _onTapBack() {
    var start = this.model.get('startTime'),
        mode = this.model.get('mode'),
        newStart = start.subtract(mode, 1);
    router.exec('/zoom', null, {startTime: newStart.valueOf(), endTime: newStart.endOf(mode).valueOf()});
  }

  function _onChangeHidden() {
    var hide = stateModel.get('hideHeader');
    if (hide) {
      $(document.body).addClass('hide-header');
    } else {
      $(document.body).removeClass('hide-header');
    }
  }

  return TimeSelectorView;

});