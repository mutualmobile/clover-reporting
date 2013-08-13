define(function(require) {
  var CustomService = require('app/data/CustomService'),
      BaseChartDataCollection = require('app/models/BaseChartDataCollection');

  var RevenueByCategoryCollection = BaseChartDataCollection.extend(function RevenueByCategoryCollection() {
    BaseChartDataCollection.apply(this, arguments);
  }, {
    fetch: function() {
      return CustomService.getRevenueByCategoryForDateRange.apply(CustomService, arguments);
    }
  });

  return new RevenueByCategoryCollection();
});