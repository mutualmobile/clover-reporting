define(function(require) {
  var Model = require('lavaca/mvc/Model'),
      moment = require('moment');

  var _MODES = [
        {key: 'day', label: 'Day', shortLabel: 'Day'},
        {key: 'week', label: 'Week', shortLabel: 'Wk'},
        {key: 'month', label: 'Month', shortLabel: 'Mo'}
        // {key: 'custom', label: 'Custom Range'}
      ],
      _DURATION_HASH = [{
          key: 'millisecond',
          duration: 1,
          format: 'SS'
        }, {
          key: 'second',
          duration: 1000,
          format: 'ss'
        }, {
          key: 'minute',
          duration: 1000 * 60,
          format: 'mm'
        }, {
          key: 'hour',
          duration: 1000 * 60 * 60,
          format: 'ha'
        }, {
          key: 'day',
          duration: 1000 * 60 * 60 * 24,
          format: 'DD'
        }, {
          key: 'month',
          duration: 1000 * 60 * 60 * 24 * 30,
          format: 'MM'
        }, {
          key: 'year',
          duration: 1000 * 60 * 60 * 24 * 365,
          format: 'YY'
        }
      ];

  var TimeRangeModel = Model.extend(function TimeRangeModel() {
    Model.apply(this, arguments);

    this.apply({
      mode: 'day',
      modes: _MODES,
      startTime: _startTime,
      endTime: _endTime
    });
    this.on('change', 'mode', _onChangeMode);
  }, {
    setCustomTimeRange: function(startTime, endTime) {
      this.set('startTime', startTime);
      this.set('endTime', endTime);
      this.trigger('rangeUpdate', {changeMode: false});
    },
    getRangeData: function(minTicks, maxTicks) {
      var start = this.get('startTime').clone(),
          end = this.get('endTime').clone(),
          startMillis = start.valueOf(),
          endMillis = end.valueOf(),
          totalDuration = endMillis - startMillis,
          currentTime,
          i,
          batchSize = 1,
          ticks = [],
          key,
          format,
          duration;

      if (maxTicks >= minTicks) {
        // Find appropriate units (minutes / hours / etc) based on minTicks
        for (i = 1; i < _DURATION_HASH.length; i++) {
          if (Math.ceil(totalDuration / _DURATION_HASH[i].duration) < minTicks) {
            break;
          }
        }
        i--;
        key = _DURATION_HASH[i].key;
        format = _DURATION_HASH[i].format;
        duration = _DURATION_HASH[i].duration;

        // Batch units as necessary (1 hour / 2 hours / etc) based on maxTicks
        while (Math.ceil(totalDuration / (duration * batchSize)) > maxTicks) {
          batchSize++;
        }

        // Round the start and end times to whole units
        start.startOf(key);
        end.startOf(key).add(key, 1);

        // Generate the intermediate ticks
        currentTime = start.clone();
        while (+(currentTime = currentTime.add(key, batchSize)) < endMillis) {
          ticks.push(currentTime.valueOf());
        }
      }

      return {
        start: start,
        end: end,
        ticks: ticks,
        format: format,
        key: key,
        duration: duration
      };
    }
  });

  // Event handlers
  function _onChangeMode(e) {
    this.apply({
      startTime: _startTime,
      endTime: _endTime
    });
    this.trigger('rangeUpdate', {changeMode: true});
  }

  // Computed Properties
  function _startTime() {
    var mode = this.get('mode');
    if (mode === 'custom') {
      return this.get('customStartTime');
    }
    return moment().startOf(mode);
  }

  function _endTime() {
    var mode = this.get('mode');
    if (mode === 'custom') {
      return this.get('customEndTime');
    }
    return moment().endOf(mode);
  }

  return new TimeRangeModel();
});