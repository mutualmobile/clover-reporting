define(function(require) {
  var CustomService = require('app/service/CustomService'),
      BaseChartDataCollection = require('app/models/BaseChartDataCollection'),
      EmployeeDetailModel = require('app/models/EmployeeDetailModel');

  var EmployeeCollection = BaseChartDataCollection.extend(function EmployeeCollection() {
    BaseChartDataCollection.apply(this, arguments);
  }, {
    TModel: EmployeeDetailModel,
    fetch: function() {
      return CustomService.getEmployeeDataForDateRange.apply(CustomService, arguments);
    }
  });

  return new EmployeeCollection();
});