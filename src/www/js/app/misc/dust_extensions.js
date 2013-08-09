define(function(require) {
  var dust = require('dust'),
      moment = require('moment');

  require('dust-helpers');

  var _UNDEFINED;

  dust.helpers.loop = function(chunk, context, bodies, params) {
    var times = parseInt(dust.helpers.tap(params.times, chunk, context), 10) || 0;

    if (context.stack.head) {
      context.stack.head['$len'] = times;
    }
    for (var i = 0; i < times; i++) {
      if (context.stack.head) {
        context.stack.head['$idx'] = i;
      }
      chunk.render(bodies.block, context);
    }
    if (context.stack.head) {
      context.stack.head['$len'] = _UNDEFINED;
      context.stack.head['$idx'] = _UNDEFINED;
    }

    return chunk;
  };

  dust.filters.commas = function(value) {
    return _addCommas(value, 0);
  };
  dust.filters.cashMoney = function(value) {
    // value is in cents
    return '$' + _addCommas(value/100, 2);
  };
  dust.filters.dateTime = function(value) {
    if (!moment.isMoment(value)) {
      value = moment(value);
    }
    return value.format('hh:mm A dddd, MMMM DD YYYY');
  };
  dust.filters.shortMonthDayTime = function(value) {
    if (!moment.isMoment(value)) {
      value = moment(value);
    }
    return value.format('MMM DD hh:mm A');
  };
  dust.filters.timestamp = function(value) {
    if (!moment.isMoment(value)) {
      value = moment(value);
    }
    return value.toISOString();
  };
  dust.filters.ymd = function(value) {
    if (!moment.isMoment(value)) {
      value = moment(value);
    }
    return value.format('YYYY-MM-DD');
  };
  dust.filters.hm = function(value) {
    if (!moment.isMoment(value)) {
      value = moment(value);
    }
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
});