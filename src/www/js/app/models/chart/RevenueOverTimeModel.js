define(function(require) {
  var BaseDataModel = require('app/models/data/BaseDataModel');

  var RevenueOverTimeModel = BaseDataModel.extend(function RevenueOverTimeModel() {
    BaseDataModel.apply(this, arguments);
    this.addDataOperation(_dataOperation);
  });

  function _dataOperation(handle) {
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