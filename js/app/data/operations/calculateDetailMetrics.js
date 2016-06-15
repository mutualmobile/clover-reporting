define(function() {
  return function(handle) {
    // Expects data like:
    // [
    //   {
    //     modified: 1234,
    //     items: {
    //       'id1234': {
    //         name: 'Name 1',
    //         qty: 3,
    //         total: 500
    //       }
    //     }
    //   },
    //   ...
    // ]
    return handle
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
      // Returns data as:
      // {
      //   first: 1234, // timestamp
      //   last: 5678, // timestamp
      //   total: 1234, // cumulative total
      //   max: 1234, // maximum for any one item
      //   items: {
      //     'id1234': {
      //       name: 'Name 1',
      //       total: 1200,
      //       qty: 6
      //     },
      //     'id5678': {
      //       name: 'Name 2',
      //       total: 900,
      //       qty: 3
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
      // Returns data as:
      // {
      //   time: 4444, // timestamp (diff between first/last)
      //   total: 1234,
      //   max: 1234,
      //   items: [
      //     {
      //       id: 'id1234',
      //       name: 'Name 1',
      //       total: 1200,
      //       qty: 6
      //     },
      //     {
      //       id: 'id5678',
      //       name: 'Name 2',
      //       total: 900,
      //       qty: 3
      //     }
      //   ]
      // }
  };
});