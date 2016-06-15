define(function() {
  return function(data, start, end, ticks, bucketAttr, sumAttr, filter) {
    var buckets = [];

    if (!data) {
      return buckets;
    }

    if (filter) {
      data = data.filter(filter);
    }

    ticks = [start].concat(ticks);

    ticks.forEach(function(tick, i) {
      buckets.push([
        tick + (((ticks[i+1] || end) - tick) / 2),
        0
      ]);
    });

    data.forEach(function(item) {
      ticks.some(function(tick, i) {
        var bucketVal = item[bucketAttr];
        if (bucketVal > tick && bucketVal < (ticks[i+1] || end)) {
          buckets[i][1] += item[sumAttr];
          return true;
        }
      });
    });

    return buckets;
  };
});