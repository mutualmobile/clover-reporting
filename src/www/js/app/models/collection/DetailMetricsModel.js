define(function(require) {
  var Model = require('lavaca/mvc/Model');

  var _HOUR = 1000 * 60 * 60;

  var DetailMetricsModel = Model.extend(function DetailMetricsModel() {
    Model.apply(this, arguments);
    this.apply({
      avgPerOrder: _avgPerOrder,
      salesPerHour: _salesPerHour,
      qtyPerHour: _qtyPerHour
    });
  });

  // Computed Properties
  function _avgPerOrder() {
    var qty = this.get('qty') || 0,
        orderCount = this.get('orderCount') || 1;
    return (qty/orderCount).toFixed(1);
  }

  function _salesPerHour() {
    var total = this.get('total') || 0,
        time = this.get('time');
    if (time) {
      return (total) / (time / _HOUR);
    }
    return -1;
  }

  function _qtyPerHour() {
    var qty = this.get('qty') || 0,
        time = this.get('time');
    if (time) {
      return (qty / (time / _HOUR)).toFixed(1);
    }
    return -1;
  }


  return DetailMetricsModel;
});