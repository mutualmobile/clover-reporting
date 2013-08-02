define(function(require) {

  var Service = require('app/data/Service');

  var OrdersService = Service.extend(function OrdersService() {
    Service.apply(this, arguments);
  }, {
    getOrdersForDateRange: function(startTime, endTime) {
      var opts = {
        start_time: startTime.valueOf(),
        end_time: endTime.valueOf()
      };
      return this.makeRequest('orders', opts);
    }
  });

  return new OrdersService();
});