define(function(require) {
  var Model = require('lavaca/mvc/Model'),
      moment = require('moment'),
      localStore = require('app/cache/localStore');

  var _LS_SELECTED_MODE = 'selectedMode',
      _LS_START_TIME = 'customStartTime',
      _LS_END_TIME = 'customEndTime';

  var _modes = [
    {key: 'day', label: 'Past 24 Hours'},
    {key: 'week', label: 'Past Week'},
    {key: 'month', label: 'Past Month'},
    {key: 'custom', label: 'Custom Range'}
  ];

  var TimeRangeModel = Model.extend(function TimeRangeModel() {
    Model.apply(this, arguments);

    var savedStartTime = parseInt(localStore.get(_LS_START_TIME), 10),
        savedEndTime = parseInt(localStore.get(_LS_END_TIME), 10);
    this.apply({
      mode: localStore.get(_LS_SELECTED_MODE) || 'day',
      modes: _modes,
      customStartTime: savedStartTime ? moment(savedStartTime) : moment().subtract('days', 1),
      customEndTime: moment(savedEndTime || new Date()),
      startTime: _startTime,
      endTime: _endTime
    });
    this.on('change', 'mode', _onChangeMode);
    this.on('change', 'customStartTime', _onChangeCustomRange);
    this.on('change', 'customEndTime', _onChangeCustomRange);
  });

  // Event handlers
  function _onChangeMode(e) {
    localStore.set(_LS_SELECTED_MODE, e.value);
    this.trigger('rangeUpdate');
  }

  function _onChangeCustomRange(e) {
    localStore.set(e.attribute, e.value.valueOf());
    if (this.get('mode') === 'custom') {
      this.trigger('rangeUpdate');
    }
  }

  // Computed Properties
  function _startTime() {
    var mode = this.get('mode');
    if (mode === 'custom') {
      return this.get('customStartTime');
    }
    return moment().subtract(mode + 's', 1);
  }

  function _endTime() {
    var mode = this.get('mode');
    if (mode === 'custom') {
      return this.get('customEndTime');
    }
    return moment();
  }

  return new TimeRangeModel();
});