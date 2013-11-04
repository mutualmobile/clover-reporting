define(function(require) {
  var BaseMetricsModel = require('app/models/metrics/BaseMetricsModel');

  var OrderMetricsModel = BaseMetricsModel.extend(function OrderMetricsModel() {
    BaseMetricsModel.apply(this, arguments);
    this.addMetric({
      totalRevenue: _totalRevenue,
      totalOrders: _totalOrders,
      revenuePerEmployee: _revenuePerEmployee,
      revenuePerCustomer: _revenuePerCustomer,
      ordersPerHour: _ordersPerHour,
      salesPerHour: _salesPerHour
    });
  });

  function _totalRevenue(handle) {
    handle
      .map(function(order) {
        return order.total;
      })
      .reduce(function(prev, current) {
        return prev + current;
      });
  }

  function _totalOrders(handle) {
    handle.reduce(function(prev) {
      return ++prev;
    }, 0);
  }

  function _revenuePerEmployee(handle) {
    handle
      .map(function(order) {
        return [order.employeeName, order.total];
      })
      .reduce(function(prev, current) {
        var employeeName = current[0],
            total = current[1];
        if (prev.employees.indexOf(employeeName) === -1) {
          prev.employees.push(employeeName);
        }
        prev.total += total;
        return prev;
      }, {
        employees: [],
        total: 0
      })
      .process(function(obj) {
        if (obj.employees.length) {
          return obj.total / obj.employees.length;
        }
        return 0;
      });
  }

  function _revenuePerCustomer(handle) {
    handle
      .map(function(order) {
        // If we don't have a customer id, assume they are a unique customer
        // and can be represented by the order id which is a uuid
        var customerId = (order.customer && order.customer.id) || order.id;
        return [customerId, order.total];
      })
      .reduce(function(prev, current) {
        var customerId = current[0],
            total = current[1];
        if (prev.customers.indexOf(customerId) === -1) {
          prev.customers.push(customerId);
        }
        prev.total += total;
        return prev;
      }, {
        customers: [],
        total: 0
      })
      .process(function(obj) {
        if (obj.customers.length) {
          return obj.total / obj.customers.length;
        }
        return 0;
      });
  }

  function _ordersPerHour(handle) {
    handle
      .map(function(order) {
        return order.modified;
      })
      .reduce(function(prev, current) {
        prev.first = Math.min(current, prev.first);
        prev.last = Math.max(current, prev.last);
        prev.orderCount++;
        return prev;
      }, {
        first: Number.MAX_VALUE,
        last: Number.MIN_VALUE,
        orderCount: 0
      })
      .process(function(obj) {
        var hour = 1000 * 60 * 60;
        if (obj.last - obj.first > 0) {
          return (obj.orderCount / ((obj.last - obj.first) / hour)).toFixed(2);
        }
        return -1;
      });
  }

  function _salesPerHour(handle) {
    handle
      .map(function(order) {
        return [order.modified, order.total];
      })
      .reduce(function(prev, current) {
        prev.first = Math.min(current[0], prev.first);
        prev.last = Math.max(current[0], prev.last);
        prev.total += current[1];
        return prev;
      }, {
        first: Number.MAX_VALUE,
        last: Number.MIN_VALUE,
        total: 0
      })
      .process(function(obj) {
        var hour = 1000 * 60 * 60;
        if (obj.last - obj.first > 0) {
          return (obj.total / ((obj.last - obj.first) / hour)).toFixed(2);
        }
        return 0;
      });
  }

  return OrderMetricsModel;
});