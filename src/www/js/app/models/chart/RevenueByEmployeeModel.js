define(function(require) {
  var BasePieChartModel = require('app/models/chart/BasePieChartModel');

  var RevenueByEmployeeModel = BasePieChartModel.extend(function RevenueByEmployeeModel() {
    BasePieChartModel.apply(this, arguments);
    this.set('popoverTitle', 'Top Employees');
    this.addDataOperation(_dataOperation);
  });

  function _dataOperation(handle) {
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