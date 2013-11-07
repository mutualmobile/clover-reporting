define(function(require) {
  var revenueForLineItem = require('app/workers/source/revenueForLineItem');

  return function(handle) {
    return handle
      .map(function(data) {
        var result = {};
        (data.lineItems || []).forEach(function(lineItem) {
          var item = lineItem.item;
          if (item && item.id && item.name) {
            if (!result[item.id]) {
              result[item.id] = {
                name: item.name,
                total: 0
              };
            }
            result[item.id].total += revenueForLineItem(lineItem);
          }
        });
        return result;
      })
      .reduce(function(counts, current) {
        for (var id in current) {
          if (!counts[id]) {
            counts[id] = current[id];
          } else {
            counts[id].total += current[id].total;
          }
        }
        return counts;
      }, {});
  };
});