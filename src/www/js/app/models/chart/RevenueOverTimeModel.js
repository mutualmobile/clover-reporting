define(function(require) {
  var BaseDataModel = require('app/models/data/BaseDataModel'),
      filterByItem = require('app/data/operations/filterByItem'),
      filterByEmployee = require('app/data/operations/filterByEmployee');

  var RevenueOverTimeModel = BaseDataModel.extend(function RevenueOverTimeModel() {
    BaseDataModel.apply(this, arguments);
    this.addDataOperation(_dataOperation);
  });

  function _dataOperation(handle) {
    // Filter if necessary
    filterByItem(handle, this.get('itemId'));
    filterByEmployee(handle, this.get('employeeId'));

    handle
      .map(function(order) {
        return {
          total: order.total,
          modified: order.modified
        };
      });
  }

  return RevenueOverTimeModel;
});