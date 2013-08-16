define(function(require) {
  var CustomService = require('app/data/CustomService'),
      BaseChartDataCollection = require('app/models/BaseChartDataCollection');

  var EmployeeCollection = BaseChartDataCollection.extend(function EmployeeCollection() {
    BaseChartDataCollection.apply(this, arguments);
  }, {
    fetch: function() {
      return CustomService.getEmployeeDataForDateRange.apply(CustomService, arguments);
    }
  });

  return new EmployeeCollection();
});