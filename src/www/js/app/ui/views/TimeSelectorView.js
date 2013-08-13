define(function(require) {

  var BaseView = require('./BaseView'),
      $ = require('$'),
      moment = require('moment'),
      router = require('lavaca/mvc/Router');

  require('rdust!templates/time_selector');

  /**
   * Time selector view
   * @class app.ui.views.TimeSelectorView
   * @extends app.ui.views.BaseView
   */
  var TimeSelectorView = BaseView.extend(function() {
    BaseView.apply(this, arguments);
    this.mapEvent({
      '.select-wrapper > div': {
        'tap': _onChangeRangeSelect.bind(this)
      },
      '[data-action="apply"]': {
        tap: _onApplyCustomDateRange.bind(this)
      },
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
    this.render();
  }, {
    template: 'templates/time_selector',
    className: 'time_selector'
  });

  function _onChangeRangeSelect(e) {
    this.model.set('mode', $(e.currentTarget).data('value'));
  }

  function _onChangeModel() {
    this.redraw();
  }

  function _onApplyCustomDateRange() {
    var startDateVal = this.el.find('#custom-start-date').val(),
        startTimeVal = this.el.find('#custom-start-time').val(),
        endDateVal = this.el.find('#custom-end-date').val(),
        endTimeVal = this.el.find('#custom-end-time').val(),
        startTime, endTime;

    startTime = moment(startDateVal + ' ' + startTimeVal);
    endTime = moment(endDateVal + ' ' + endTimeVal);
    this.model.set('customStartTime', startTime);
    this.model.set('customEndTime', endTime);
  }

  function _onTapToggleDropdown(e) {
    var $el = $(e.currentTarget),
        shouldShow = !$el.hasClass('open');

    $el.toggleClass('open');
    this.el.find('.picker').css('display', shouldShow ? 'block': 'none');
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