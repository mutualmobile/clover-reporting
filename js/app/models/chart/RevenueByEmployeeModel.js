define(function(require) {
  var BasePieChartModel = require('app/models/chart/BasePieChartModel'),
      filterByItem = require('app/data/operations/filterByItem');

  var RevenueByEmployeeModel = BasePieChartModel.extend(function RevenueByEmployeeModel() {
    BasePieChartModel.apply(this, arguments);
    this.apply({
      popoverTitle: 'Top Employees',
      pieDetailList: _pieDetailList
    });
    this.addDataOperation(_dataOperation);
  });

  // Private functions

  function _dataOperation(handle) {
    // Filter if necessary
    filterByItem(handle, this.get('itemId'));
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

  // Computed properties

  function _pieDetailList() {
    return this.get('data').slice(0).sort(function(a, b) {
      return b.value - a.value;
    });
  }

  return RevenueByEmployeeModel;
});