define(function(require) {
  var calculateDetailMetrics = require('app/data/operations/calculateDetailMetrics');

  return function(handle) {
    handle
      .map(function(order) {
        var result = {
              modified: order.modified,
              items: {}
            },
            item = {
              name: order.employeeName,
              total: order.total,
              qty: 0
            };
        (order.lineItems || []).forEach(function(lineItem) {
          if (lineItem.item) {
            if (lineItem.item.priceType === "PER_UNIT") {
              var quantity = 1;
            } else {
              var quantity = lineItem.qty;
            }
          } else {
            var quantity = lineItem.qty;
          }

          item.qty += quantity || 0;
        });
        result.items[order.employeeName] = item;  // employeeId not provided, for now
        return result;
      });
    calculateDetailMetrics(handle);
  };

});