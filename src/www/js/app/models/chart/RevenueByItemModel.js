define(function(require) {
  var BasePieChartModel = require('app/models/chart/BasePieChartModel'),
      revenueForLineItem = require('app/workers/source/revenueForLineItem'); // Will be exposed globally in worker

  var RevenueByItemModel = BasePieChartModel.extend(function RevenueByItemModel() {
    BasePieChartModel.apply(this, arguments);
    this.set('popoverTitle', 'Top Items');
    this.addDataOperation(_dataOperation);
  });

  function _dataOperation(handle) {
    handle
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
      });
    this.applyStandardFormatting(handle);
  }

  return RevenueByItemModel;
});