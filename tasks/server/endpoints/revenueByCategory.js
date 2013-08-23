var Q = require('q'),
    allCategories = require('./allCategories'),
    revenueByItem = require('./revenueByItem');

function revenueByCategory(req, res) {
  var totals = {},
      data = [],
      fetches = [allCategories(req), revenueByItem(req)],
      deferred = Q.defer();

  Q.all(fetches).then(function(respone) {
    var categories = respone[0],
        revenueByItemArr = respone[1],
        revenueByItem = {};

    // Convert revenue by item data from an array of objects into
    // nested objects where each key is the object id, so that we
    // don't have to continually loop through the array
    revenueByItemArr.forEach(function(obj) {
      revenueByItem[obj.id] = obj;
    });

    categories.forEach(function(category) {
      category.items.forEach(function(item) {
        var itemRevenue = revenueByItem[item.id];
        if (itemRevenue) {
          if (!totals[category.id]) {
            totals[category.id] = {
              id: category.id,
              name: category.name,
              total: 0,
              count: 0
              // items: []
            };
          }
          totals[category.id].total += itemRevenue.total;
          totals[category.id].count += itemRevenue.count;
          // totals[category.id].items.push(itemRevenue);
        }
      });
    });
    for (var category in totals) {
      data.push(totals[category]);
    }
    if (res) {
      res.send(data);
    }
    deferred.resolve(data);
  }, function() {
    if (res) {
      res.send(500);
    }
    deferred.reject();
  });
  return deferred.promise;
}

module.exports = revenueByCategory;