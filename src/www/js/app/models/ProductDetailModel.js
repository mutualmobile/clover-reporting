define(function(require) {
  var Model = require('lavaca/mvc/Model');

  var ProductDetailModel = Model.extend(function ProductDetailModel() {
    Model.apply(this, arguments);
    this.apply({
      'barChartLabel': 'Product Sales'
    });
  });

  return ProductDetailModel;
});