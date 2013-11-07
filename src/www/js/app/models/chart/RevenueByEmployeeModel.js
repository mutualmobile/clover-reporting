define(function(require) {
  var BasePieChartModel = require('app/models/chart/BasePieChartModel'),
      revenueForLineItem = require('app/workers/source/revenueForLineItem');

  var RevenueByEmployeeModel = BasePieChartModel.extend(function RevenueByEmployeeModel() {
    BasePieChartModel.apply(this, arguments);
    this.set('popoverTitle', 'Top Employees');
    this.addDataOperation(_dataOperation);
  });

  function _dataOperation(handle) {
    // Filter if necessary
    var itemId = this.get('itemId');
    if (itemId) {
      handle.process(function(data, itemId) {
        return data.map(function(order) {
          var result = {
            employeeName: order.employeeName,
            total: 0
          };
          (order.lineItems || []).forEach(function(lineItem) {
            var item = lineItem.item;
            if (item && item.id === itemId) {
              result.total += revenueForLineItem(lineItem);
            }
          });
          return result;
        });
      }, itemId);
    }

    // Calcuate totals
    handle
      .map(function(order) {
        var employeeName = order.employeeName,
            result = {};
        if (employeeName) {
          result[employeeName] = order.total;
        }
        return result;
      });
    this.applyStandardFormatting(handle);
  }

  return RevenueByEmployeeModel;
});