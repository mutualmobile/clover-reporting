define(function(require) {
  var Model = require('lavaca/mvc/Model');

  var _HOUR = 1000 * 60 * 60,
      _MIN_DURATION = 1000 * 60 * 10;

  var ProductDetailModel = Model.extend(function ProductDetailModel() {
    Model.apply(this, arguments);
    this.apply({
      'pieDetailList': _pieDetailList,
      'drinksPerOrder': _drinksPerOrder,
      'salesPerHour': _salesPerHour,
      'drinksPerHour': _drinksPerHour,
      'barChartLabel': 'Product Sales'
    });
  });

  // Computed Properties
  function _pieDetailList() {
    var data = this.get('employees');
    data.sort(function(a, b) {
      return b.count - a.count;
    });
    return data;
  }

  function _drinksPerOrder() {
    var orders = this.get('orders');
    if (orders && orders.length) {
      return (this.get('count') / orders.length).toFixed(2);
    }
  }

  function _salesPerHour() {
    var firstOrder = this.get('firstOrder'),
        lastOrder = this.get('lastOrder'),
        total = this.get('total');

    if (firstOrder && lastOrder && (lastOrder - firstOrder) > _MIN_DURATION) {
      return total / ((lastOrder - firstOrder) / _HOUR);
    }
    return -1;
  }

  function _drinksPerHour() {
    var firstOrder = this.get('firstOrder'),
        lastOrder = this.get('lastOrder'),
        count = this.get('count');

    if (firstOrder && lastOrder && count) {
      return (count / ((lastOrder - firstOrder) / _HOUR)).toFixed(2);
    }
    return -1;
  }

  return ProductDetailModel;
});