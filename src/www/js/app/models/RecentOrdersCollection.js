define(function(require) {
  var Promise = require('lavaca/util/Promise'),
      BaseChartDataCollection = require('app/models/BaseChartDataCollection'),
      OrdersService = require('app/data/OrdersService');

  var RecentOrdersCollection = BaseChartDataCollection.extend(function RecentOrdersCollection() {
    BaseChartDataCollection.apply(this, arguments);
    this.apply({
      totalRevenue: _totalRevenue,
      revenuePerEmployee: _revenuePerEmployee,
      revenuePerCustomer: _revenuePerCustomer
    });
  }, {
    fetch: function() {
      var promise = new Promise();
      OrdersService.getOrdersForDateRange.apply(OrdersService, arguments).then(function(data) {
        if (data && data.orders) {
          return promise.resolve(data.orders);
        }
        promise.reject();
      }, promise.rejector());
      return promise;
    }
  });

  // Computed Properties
  function _totalRevenue() {
    var total = 0;
    this.each(function(index, order) {
      total += order.get('total');
    });
    return total;
  }
  function _revenuePerEmployee() {
    var employees = [],
        totalRevenue = 0;
    this.each(function(index, order) {
      var employeeName = order.get('employeeName');
      if (employeeName && employees.indexOf(employeeName) === -1) {
        employees.push(employeeName);
      }
      totalRevenue += order.get('total');
    });

    // Dividing by zero is bad, mmmkay?
    if (employees.length) {
      return totalRevenue / employees.length;
    }
    return null;
  }
  function _revenuePerCustomer() {
    var customers = [],
        customerCount = 0,
        totalRevenue = 0;
    this.each(function(index, order) {
      var customer = order.get('customer');
      if (customer && customers.indexOf(customer.id) === -1) {
        customers.push(customer.id);
        customerCount++;
      } else if (!customer) {
        customerCount++;
      }
      totalRevenue += order.get('total');
    });

    // Dividing by zero is bad, mmmkay?
    if (customerCount) {
      return totalRevenue / customerCount;
    }
    return null;
  }

  return new RecentOrdersCollection();
});