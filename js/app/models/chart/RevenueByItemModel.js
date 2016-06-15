define(function(require) {
  var BasePieChartModel = require('app/models/chart/BasePieChartModel'),
      revenueForLineItem = require('app/workers/source/revenueForLineItem'), // Will be exposed globally in worker
      filterByEmployee = require('app/data/operations/filterByEmployee');

  var RevenueByItemModel = BasePieChartModel.extend(function RevenueByItemModel() {
    BasePieChartModel.apply(this, arguments);
    this.apply({
      popoverTitle: 'Top Items',
      pieDetailList: _pieDetailList
    });
    this.addDataOperation(_dataOperation);
  });

  function _dataOperation(handle) {
    // Filter if necessary
    filterByEmployee(handle, this.get('employeeName'));

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

  // Computed properties

  function _pieDetailList() {
    return this.get('data').slice(0).sort(function(a, b) {
      return b.value - a.value;
    });
  }

  return RevenueByItemModel;
});