define(function(require) {
  var BasePieChartModel = require('app/models/BasePieChartModel');

  var RevenueByEmployeeModel = BasePieChartModel.extend(function RevenueByEmployeeModel() {
    BasePieChartModel.apply(this, arguments);
    this.set('popoverTitle', 'Top Employees');
  }, {
    setDataOperations: function() {
      this
        .map(function(order) {
          var employeeName = order.employeeName,
              result = {};
          if (employeeName) {
            result[employeeName] = order.total;
          }
          return result;
        })
        .applyStandardFormatting();
    }
  });

  return RevenueByEmployeeModel;
});