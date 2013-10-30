define(function(require) {
  var Promise = require('lavaca/util/Promise'),
      BaseChartDataCollection = require('app/models/BaseChartDataCollection'),
      CustomService = require('app/service/CustomService');

  var _HOUR = 1000 * 60 * 60,
      _MIN_DURATION = 1000 * 60 * 10;

  var RecentOrdersCollection = BaseChartDataCollection.extend(function RecentOrdersCollection() {
    BaseChartDataCollection.apply(this, arguments);
    this.apply({
      totalRevenue: _totalRevenue,
      revenuePerEmployee: _revenuePerEmployee,
      revenuePerCustomer: _revenuePerCustomer,
      ordersPerHour: _ordersPerHour,
      salesPerHour: _salesPerHour
    });
  }, {
    fetch: function() {
      var promise = new Promise(),
          servicePromise;
      servicePromise = CustomService.getOrdersForDateRange.apply(CustomService, arguments).then(function(data, hash) {
        var orders = [];
        if (data && data.orders) {
          orders = data.orders;
        }
        promise.resolve(orders, hash);
      });
      promise.error(function() {
        servicePromise.reject.apply(servicePromise, arguments);
      });
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

  function _ordersPerHour() {
    var firstOrder = Number.MAX_VALUE,
        lastOrder = Number.MIN_VALUE;
    this.each(function(index, model) {
      firstOrder = Math.min(firstOrder, model.get('timestamp'));
      lastOrder = Math.max(lastOrder, model.get('modified'));
    });
    if (lastOrder - firstOrder > _MIN_DURATION) {
      return (this.count() / ((lastOrder - firstOrder) / _HOUR)).toFixed(2);
    }
    return -1;
  }

  function _salesPerHour() {
    var firstOrder = Number.MAX_VALUE,
        lastOrder = Number.MIN_VALUE;
    this.each(function(index, model) {
      firstOrder = Math.min(firstOrder, model.get('timestamp'));
      lastOrder = Math.max(lastOrder, model.get('modified'));
    });
    if (lastOrder - firstOrder > _MIN_DURATION) {
      return (this.get('totalRevenue') / ((lastOrder - firstOrder) / _HOUR));
    }
    return -1;
  }

  return new RecentOrdersCollection();
});