define(function() {

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
          item.qty += lineItem.qty || 0;
        });
        result.items[order.employeeName] = item;  // employeeId not provided, for now
        return result;
      })
      // [
      //   {
      //     modified: 1234,
      //     items: {
      //       Taylor: {
      //         name: 'Taylor',
      //         qty: 123,
      //         total: 123
      //       }
      //     }
      //   },
      //   ...
      // ]
      .reduce(function(result, current) {
        result.first = Math.min(result.first, current.modified);
        result.last = Math.max(result.last, current.modified);
        for (var id in current.items) {
          if (!result.items[id]) {
            result.items[id] = current.items[id];
            result.items[id].orderCount = 1;
          } else {
            result.items[id].total += current.items[id].total;
            result.items[id].qty += current.items[id].qty;
            result.items[id].orderCount += 1;
          }
          result.max = Math.max(result.max, result.items[id].total);
          result.total += current.items[id].total;
        }
        return result;
      }, {
        first: Number.MAX_VALUE,
        last: Number.MIN_VALUE,
        max: 0,
        total: 0,
        items: {}
      })
      // {
      //   first: 1234,
      //   last: 5678,
      //   total: 1234,
      //   max: 1234,
      //   items: {
      //     Taylor: {
      //       name: 'Taylor',
      //       total: 1234,
      //       qty: 1234
      //     },
      //     Sam: {
      //       name: 'Sam',
      //       total: 1234,
      //       qty: 1234
      //     }
      //   }
      // }
      .process(function(totals) {
        var items = [];

        // Calculate total time
        if (totals.first < Number.MAX_VALUE && totals.last > Number.MIN_VALUE) {
          totals.time = totals.last - totals.first;
        } else {
          totals.time = 0;
        }
        delete totals.first;
        delete totals.last;

        // Convert object with id keys into an array
        for (var id in totals.items) {
          totals.items[id].id = id;
          totals.items[id].time = totals.time;
          totals.items[id].percentOfMax = totals.items[id].total / totals.max;
          totals.items[id].percentOfTotal = totals.items[id].total / totals.total;
          items.push(totals.items[id]);
        }

        totals.items = items;
        return totals;
      });
      // {
      //   time: 4444,
      //   total: 1234,
      //   max: 1234,
      //   items: [
      //     {
      //       id: 'Taylor',
      //       name: 'Taylor',
      //       total: 1234,
      //       qty: 1234
      //     },
      //     {
      //       id: 'Sam',
      //       name: 'Sam',
      //       total: 1234,
      //       qty: 1234
      //     }
      //   ]
      // }
  };

});