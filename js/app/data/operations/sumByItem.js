define(function(require) {
  var revenueForLineItem = require('app/workers/source/revenueForLineItem'),
      calculateDetailMetrics = require('app/data/operations/calculateDetailMetrics');

  return function(handle) {
    handle
      .map(function(order) {
        var result = {
          modified: order.modified,
          items: {}
        };
        (order.lineItems || []).forEach(function(lineItem) {
          var item = lineItem.item,
              itemObj;
          if (item && item.id && item.name) {
            itemObj = result.items[item.id];
            if (!itemObj) {
              itemObj = result.items[item.id] = {
                name: item.name,
                qty: 0,
                total: 0
              };
            }

            itemObj.total += revenueForLineItem(lineItem);

            if (item.priceType === "PER_UNIT") {
              itemObj.qty += 1;
            } else {
              itemObj.qty += lineItem.qty;
            }
          }
        });
        return result;
      });
    calculateDetailMetrics(handle);
  };

});