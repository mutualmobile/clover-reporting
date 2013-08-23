var Q = require('q'),
    allOrders = require('./allOrders'),
    revenueByCategory = require('./revenueByCategory'),
    revenueByItem = require('./revenueByItem');

function employeeData(req, res) {
  var totals = {},
      totalRevenue = 0,
      data = [],
      fetches = [],
      deferred = Q.defer();

  allOrders(req).then(function(orders) {
    orders.forEach(function(order) {
      var employeeId = order.employeeId,
          revenueByCategoryFetch,
          revenueByItemFetch;
      if (!totals[employeeId]) {
        totals[employeeId] = {
          id: employeeId,
          name: order.employeeName,
          total: 0,
          count: 0,
          percent: 0,
          orderCount: 0,
          firstOrder: Number.MAX_VALUE,
          lastOrder: Number.MIN_VALUE
        };
        req.employeeId = employeeId;
        revenueByCategoryFetch = revenueByCategory(req);
        revenueByCategoryFetch.then(function(data) {
          totals[employeeId].revenueByCategory = data;
        });
        revenueByItemFetch = revenueByItem(req);
        revenueByItemFetch.then(function(items) {
          items.sort(function(a, b) {
            return b.total - a.total;
          });
          totals[employeeId].revenueByItem = items;
          items.forEach(function(item) {
            totals[employeeId].total += item.total;
            totals[employeeId].count += item.count;
            totalRevenue += item.total;
          });
        });
        fetches.push(revenueByCategoryFetch, revenueByItemFetch);
      }
      totals[employeeId].firstOrder = Math.min(totals[employeeId].firstOrder, order.timestamp);
      totals[employeeId].lastOrder = Math.max(totals[employeeId].lastOrder, order.modified);
      totals[employeeId].orderCount++;
    });
    Q.all(fetches).then(function() {
      var item,
          highestPercent = 0;
      for (item in totals) {
        totals[item].percent = totals[item].total / totalRevenue;
        highestPercent = Math.max(totals[item].percent, highestPercent);
      }
      for (item in totals) {
        totals[item].relativePercent = totals[item].percent / highestPercent;
        data.push(totals[item]);
      }
      data.sort(function(a, b) {
        return b.total - a.total;
      });
      if (res) {
        res.send(data);
      }
      deferred.resolve(data);
    });
  }, function() {
    if (res) {
      res.send(500);
    }
    deferred.reject();
  });
  return deferred.promise;
}

module.exports = employeeData;