define(function(require) {

  var BaseView = require('./BaseView'),
      $ = require('$'),
      moment = require('moment'),
      router = require('lavaca/mvc/Router'),
      PageMenuView = require('app/ui/controls/PageMenuView'),
      ModeMenuView = require('app/ui/controls/ModeMenuView'),
      stateModel = require('app/models/StateModel'),
      transition = require('lavaca/fx/Transition'),
      transform = require('lavaca/fx/Transform');

  var _MOVE_THRESHOLD = 10,
      _TRANSITION_PROP = transition.cssProperty(),
      _TRANSITION_DURATION_PROP = _TRANSITION_PROP + '-duration',
      _TRANSITION_END_PROP = transition.transitionEndProperty(),
      _TRANSFORM_PROP = transform.cssProperty(),
      _UNDEFINED;

  require('rdust!templates/time_selector');

  /**
   * Time selector view
   * @class app.ui.views.TimeSelectorView
   * @extends app.ui.views.BaseView
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
    this.container = $(document.body).find('#view-root');
    this.container
      .on('touchstart', _onDragStart.bind(this))
      .on('touchmove', _onDragMove.bind(this))
      .on('touchend', _onDragEnd.bind(this))
      .on('touchcancel', _onDragCancel.bind(this));
    this.render();
  }, {
    template: 'templates/time_selector',
    className: 'time_selector'
  });

  function _onDragStart(e) {
    this.moved = false;
    this.startX = e.originalEvent.touches[0].clientX;
    this.startY = e.originalEvent.touches[0].clientY;
    this.currentX = 0;
    this.currentY = 0;
    this.translateX = 0;
    _setTransitionDuration.call(this, 0);
  }

  function _onDragMove(e) {
    var x = e.originalEvent.touches[0].clientX,
        y = e.originalEvent.touches[0].clientY;
    if (Math.abs(x - this.startX) > _MOVE_THRESHOLD) {
      e.preventDefault();
      this.moved = true;
      this.translateX = ((x - this.currentX) / 5) + this.translateX;
      _translate.call(this, this.translateX);
    }
    this.currentX = x;
    this.currentY = y;
  }

  function _onDragEnd() {
    if (this.translateX > 50) {
      _onTapBack.call(this);
    } else if (this.translateX < -50) {
      _onTapForward.call(this);
    }
    this.moved = false;
    this.startX = 0;
    this.startY = 0;
    this.translateX = 0;
    this.container.find('.overflow-scroll').removeClass('disbale');
    _setTransitionDuration.call(this, 500);
    _translate.call(this, 0);
  }

  function _onDragCancel() {
    this.moved = false;
    this.startX = 0;
    this.startY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.translateX = 0;
    _translate.call(this, 0);
  }

  function _translate(x) {
    this.container.css(_TRANSFORM_PROP, 'translate3d(' + x + 'px, 0, 0)');
  }

  function _setTransitionDuration(duration) {
    var durationString = typeof duration === 'string' ? duration : duration + 'ms';
    this.container.css(_TRANSITION_DURATION_PROP, durationString);
  }

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

  return TimeSelectorView;

});