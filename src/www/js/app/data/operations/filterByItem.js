define(function(require) {
  var revenueForLineItem = require('app/workers/source/revenueForLineItem');

  return function(handle, itemId) {
    if (itemId) {
      handle.process(function(data, itemId) {
        return data.map(function(order) {
          var result = order;
          result.total = 0;
          (order.lineItems || []).forEach(function(lineItem) {
            var item = lineItem.item;
            if (item && item.id === itemId) {
              result.total += revenueForLineItem(lineItem);
            }
          });
          return result;
        });
      }, itemId);
    }
  };

});