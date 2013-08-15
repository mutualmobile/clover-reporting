define(function(require) {
  var CustomService = require('app/data/CustomService'),
      revenueByItemCollection = require('app/models/RevenueByItemCollection'),
      BaseChartDataCollection = require('app/models/BaseChartDataCollection');

  var RevenueByCategoryCollection = BaseChartDataCollection.extend(function RevenueByCategoryCollection() {
    BaseChartDataCollection.apply(this, arguments);
    this.apply({
      'popoverData': revenueByItemCollection
    });
  }, {
    fetch: function() {
      return CustomService.getRevenueByCategoryForDateRange.apply(CustomService, arguments);
    }
  });

  return new RevenueByCategoryCollection();
});