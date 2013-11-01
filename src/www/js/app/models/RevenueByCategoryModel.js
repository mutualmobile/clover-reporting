define(function(require) {
  var BasePieChartModel = require('app/models/BasePieChartModel'),
      revenueForLineItem = require('app/workers/source/revenueForLineItem'); // Will be exposed globally in worker

  var RevenueByCategoryModel = BasePieChartModel.extend(function RevenueByCategoryModel() {
    BasePieChartModel.apply(this, arguments);
  }, {
    setDataOperations: function() {
      this
        .map(function(order) {
          var lineItems = order.lineItems,
              result = {};
          if (lineItems && lineItems.length) {
            lineItems.forEach(function(lineItem) {
              var categories = (lineItem.item && lineItem.item.categories) || [];
              categories.forEach(function(category) {
                var name = category.name;
                result[name] = (result[name] || 0) + revenueForLineItem(lineItem);
              });
            });
          }
          return result;
        })
        .applyStandardFormatting();
    }
  });

  return RevenueByCategoryModel;
});