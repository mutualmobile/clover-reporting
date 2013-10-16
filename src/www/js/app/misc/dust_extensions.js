define(function(require) {
  var dust = require('dust'),
      moment = require('moment');
  require('dust-helpers');

  dust.helpers.moment = function(chunk, context, bodies, params) {
    var val = parseInt(dust.helpers.tap(params.value, chunk, context) || 0, 10),
        format = dust.helpers.tap(params.format, chunk, context);

    if (val && format) {
      if (!moment.isMoment(val)) {
        val = moment(val);
      }
      return chunk.write(val.format(format));
    }
    return chunk;
  };

  dust.filters.percent = function(value) {
    return Math.round(value * 100) + '%';
  };

  dust.filters.commas = function(value) {
    return _addCommas(value, 0);
  };
  dust.filters.cashMoney = function(value) {
    // value is in cents
    if (value > 99999) {
      return '<span class="dollar light">$</span>' + _addCommas(value / 100000, 2) + '<span class="light">K</span>';
    } else {
      value = _addCommas(value / 100, 2);
      value = (''+value).split('.');
      return '<span class="dollar light">$</span>' + value[0] + '<span class="light">.' + value[1] + '</span>';
    }
  };
  dust.filters.dateTime = function(value) {
    value = _ensureMoment(value);
    return value.format('hh:mm A dddd, MMMM DD YYYY');
  };
  dust.filters.shortMonthDayTime = function(value) {
    value = _ensureMoment(value);
    return value.format('MMM DD hh:mm A');
  };
  dust.filters.scopeDay = function(value) {
    value = _ensureMoment(value);
    return value.format('MMMM DD YYYY');
  };
  dust.filters.scopeWeek = function(value) {
    value = _ensureMoment(value);
    return value.format('MMMM YYYY');
  };
  dust.filters.scopeMonth = function(value) {
    value = _ensureMoment(value);
    return value.format('MMMM YYYY');
  };
  dust.filters.timestamp = function(value) {
    value = _ensureMoment(value);
    return value.toISOString();
  };
  dust.filters.ymd = function(value) {
    value = _ensureMoment(value);
    return value.format('YYYY-MM-DD');
  };
  dust.filters.hm = function(value) {
    value = _ensureMoment(value);
    return value.format('HH:mm');
  };

  // Private functions
  function _addCommas(value, decimalDigits) {
    var output = '',
        decimal = '';
    value = parseFloat(value); // make sure its a number
    if (decimalDigits) {
      decimal = '' + value.toFixed(decimalDigits);
      decimal = decimal.substring(decimal.indexOf('.'));
      output = '' + Math.floor(value);
    } else {
      output = '' + Math.round(value);
    }
    while (/(\d)(?=(\d\d\d)+(?!\d))/g.test(output)) {
      output = output.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }
    return output + decimal;
  }

  function _ensureMoment(value) {
    if (!moment.isMoment(value)) {
      value = moment(value);
    }
    return value;
  }
});