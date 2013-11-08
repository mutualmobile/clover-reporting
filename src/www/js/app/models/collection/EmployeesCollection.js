define(function (require) {
  var BaseDataCollection = require('app/models/data/BaseDataCollection'),
      EmployeeMetricsModel = require('app/models/collection/EmployeeMetricsModel'),
      sumByEmployee = require('app/data/operations/sumByEmployee');

  var EmployeesCollection = BaseDataCollection.extend(function EmployeesCollection() {
    BaseDataCollection.apply(this, arguments);
    this.addDataOperation(_dataOperation);
  }, {
    TModel: EmployeeMetricsModel,
    onDataChange: function(data) {
      BaseDataCollection.prototype.onDataChange.call(this, data.items);
    }
  });

  function _dataOperation(handle) {
    sumByEmployee(handle);
    handle.process(function(data) {
      data.items.sort(function(a, b) {
        return b.total - a.total;
      });
      return data;
    });
  }

  return EmployeesCollection;
});