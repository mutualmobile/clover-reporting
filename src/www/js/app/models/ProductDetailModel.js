define(function(require) {
  var Model = require('lavaca/mvc/Model');

  var ProductDetailModel = Model.extend(function ProductDetailModel() {
    Model.apply(this, arguments);
    this.apply({
      'pieDetailList': _pieDetailList,
      'barChartLabel': 'Product Sales',
      'averageOrder': _averageOrder
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

  function _averageOrder() {
    var count = this.get('count');
    if (count) {
      return this.get('total') / count;
    }
  }

  return ProductDetailModel;
});