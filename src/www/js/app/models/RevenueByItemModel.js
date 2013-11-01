define(function(require) {
  var BasePieChartModel = require('app/models/BasePieChartModel'),
      revenueForLineItem = require('app/workers/source/revenueForLineItem'); // Will be exposed globally in worker

  var RevenueByItemModel = BasePieChartModel.extend(function RevenueByItemModel() {
    BasePieChartModel.apply(this, arguments);
    this.set('popoverTitle', 'Top Items');
  }, {
    setDataOperations: function() {
      this
        .map(function(order) {
          var lineItems = order.lineItems,
              result = {};
          if (lineItems && lineItems.length) {
            lineItems.forEach(function(lineItem) {
              var name = lineItem.name;
              if (name) {
                result[name] = (result[name] || 0) + revenueForLineItem(lineItem);
              }
            });
          }
          return result;
        })
        .applyStandardFormatting();
    }
  });

  return RevenueByItemModel;
});