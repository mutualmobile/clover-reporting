define(function(require) {
  var Model = require('lavaca/mvc/Model');

  var ProductDetailModel = Model.extend(function ProductDetailModel() {
    Model.apply(this, arguments);
    this.apply({
      'pieDetailList': _pieDetailList,
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

  return ProductDetailModel;
});