define(function(require) {
  var CustomService = require('app/data/CustomService'),
      BaseChartDataCollection = require('app/models/BaseChartDataCollection');

  var ProductCollection = BaseChartDataCollection.extend(function ProductCollection() {
    BaseChartDataCollection.apply(this, arguments);
  }, {
    fetch: function() {
      return CustomService.getProductDataForDateRange.apply(CustomService, arguments);
    }
  });

  return new ProductCollection();
});