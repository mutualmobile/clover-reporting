var Q = require('q'),
    shared = require('../shared'),
    allOrders = require('./allOrders');

function revenueByItem(req, res) {
  var totals = {},
      data = [],
      deferred = Q.defer(),
      employeeId = req.employeeId;

  allOrders(req).then(function(orders) {
    orders.forEach(function(order) {
      var lineItems = order.lineItems || [];

      // Filters
      if (employeeId && order.employeeId !== employeeId) { return; }

      lineItems.forEach(function(lineItem) {
        var revenue = shared.revenueForLineItem(lineItem),
            itemId = lineItem.itemId || 'manual';
        if (!totals[itemId]) {
          totals[itemId] = {
            id: itemId,
            name: lineItem.name,
            total: 0,
            count: 0
          };
        }
        totals[itemId].total += revenue;
        totals[itemId].count++;
      });
    });
    for (var item in totals) {
      data.push(totals[item]);
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

module.exports = revenueByItem;