var Q = require('q'),
    shared = require('../shared'),
    allOrders = require('./allOrders'),
    revenueByItem = require('./revenueByItem');

function productData(req, res) {
  var deferred = Q.defer(),
      fetches = [allOrders(req), revenueByItem(req)],
      data = [];

  Q.all(fetches).then(function(response) {
    var allOrders = response[0],
        revenueByItem = response[1],
        totalRevenue = 0,
        items = {},
        highestPercent = 0,
        item;

    // Add attributes to item objects
    revenueByItem.forEach(function(item) {
      totalRevenue += item.total;
    });
    revenueByItem.forEach(function(item) {
      item.percent = item.total / totalRevenue;
      item.orderIds = {};
      item.employeeIds = {};
      item.firstOrder = Number.MAX_VALUE;
      item.lastOrder = Number.MIN_VALUE;
      items[item.id] = item;
      highestPercent = item.percent > highestPercent ? item.percent : highestPercent;
    });

    revenueByItem.forEach(function(item) {
      item.relativePercent = item.percent / highestPercent;
    });

    // Calculate order/employee data
    allOrders.forEach(function(order) {
      var lineItems = order.lineItems || [],
          reducedOrder = {
            id: order.id,
            timestamp: order.timestamp,
            modified: order.modified,
            employeeId: order.employeeId,
            employeeName: order.employeeName
          };
      lineItems.forEach(function(lineItem) {
        var revenue = shared.revenueForLineItem(lineItem),
            item = items[lineItem.itemId] || items.manual;
        if (item) {
          // Update orders
          if (!item.orderIds[order.id]) {
            item.orderIds[order.id] = shared.extend({total: 0, count: 0}, reducedOrder);
          }
          item.orderIds[order.id].total += revenue;
          item.orderIds[order.id].count += lineItem.qty;

          // Update employee
          if (!item.employeeIds[order.employeeId]) {
            item.employeeIds[order.employeeId] = shared.extend({total: 0, count: 0}, {
              id: order.employeeId,
              name: order.employeeName
            });
          }
          item.employeeIds[order.employeeId].total += revenue;
          item.employeeIds[order.employeeId].count += lineItem.qty;
          item.firstOrder = Math.min(item.firstOrder, order.timestamp);
          item.lastOrder = Math.max(item.lastOrder, order.modified);
        }
      });
    });

    // Re-format objects as arrays
    for (var itemId in items) {
      item = items[itemId];
      // Orders
      item.orders = [];
      for (var orderId in item.orderIds) {
        item.orders.push(item.orderIds[orderId]);
      }
      item.orders.sort(function(a, b) {
        return b.modified - a.modified;
      });
      delete item.orderIds;

      // Employees
      item.employees = [];
      for (var employeeId in item.employeeIds) {
        item.employees.push(item.employeeIds[employeeId]);
      }
      item.employees.sort(function(a, b) {
        return a.name.localeCompare(b.name);
      });
      delete item.employeeIds;

      data.push(item);
    }
    data.sort(function(a, b) {
      return b.total - a.total;
    });

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

module.exports = productData;