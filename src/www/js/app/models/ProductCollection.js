define(function(require) {
  var CustomService = require('app/service/CustomService'),
      ProductDetailModel = require('app/models/ProductDetailModel'),
      BaseChartDataCollection = require('app/models/BaseChartDataCollection');

  var ProductCollection = BaseChartDataCollection.extend(function ProductCollection() {
    BaseChartDataCollection.apply(this, arguments);
  }, {
    TModel: ProductDetailModel,
    fetch: function() {
      return CustomService.getProductDataForDateRange.apply(CustomService, arguments);
    }
  });

  return new ProductCollection();
});