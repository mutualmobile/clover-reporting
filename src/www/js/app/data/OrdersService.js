define(function(require) {

  var Service = require('app/data/Service'),
      moment = require('moment');

  var OrdersService = Service.extend(function OrdersService() {
    Service.apply(this, arguments);
  }, {
    getOrdersForToday: function() {
      var start = moment().subtract('days', 1),
          end = moment();
      return this.getOrdersForDateRange(start, end);
    },
    getOrdersForDateRange: function(startTime, endTime) {
      var opts = {
        start_time: startTime.valueOf(),
        end_time: endTime.valueOf()
      };
      return this.makeRequest(true, 'recent_orders', opts);
    }
  });

  return new OrdersService();
});