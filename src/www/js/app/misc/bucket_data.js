define(function() {
  return function(collection, start, end, ticks, bucketAttr, sumAttr, filter) {
    var buckets = [],
        filteredItems,
        getBucketVal,
        getSumVal;

    if (!collection) {
      return buckets;
    }

    filteredItems = filter ? collection.filter(filter) : collection.models,

    ticks = [start].concat(ticks);

    ticks.forEach(function(tick, i) {
      buckets.push([
        tick + (((ticks[i+1] || end) - tick) / 2),
        0
      ]);
    });

    if (typeof bucketAttr === 'string') {
      getBucketVal = function(model) {
        return model.get(bucketAttr);
      };
    } else {
      getBucketVal = bucketAttr;
    }
    if (typeof sumAttr === 'string') {
      getSumVal = function(model) {
        return model.get(sumAttr);
      };
    } else {
      getSumVal = sumAttr;
    }

    filteredItems.forEach(function(model) {
      ticks.some(function(tick, i) {
        var bucketVal = getBucketVal(model);
        if (bucketVal > tick && bucketVal < (ticks[i+1] || end)) {
          buckets[i][1] += getSumVal(model);
        }
      });
    });

    return buckets;
  };
});