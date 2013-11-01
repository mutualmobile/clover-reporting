define(function(require) {
  var BaseDataModel = require('app/models/BaseDataModel');

  var RevenueOverTimeModel = BaseDataModel.extend(function RevenueOverTimeModel() {
    BaseDataModel.apply(this, arguments);
  }, {
    setDataOperations: function() {
      this
        .map(function(order) {
          return {
            total: order.total,
            modified: order.modified
          };
        });
    }
  });

  return RevenueOverTimeModel;
});