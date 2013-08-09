define(function(require) {

  var Service = require('app/data/Service');

  var CustomService = Service.extend(function CustomService() {
    Service.apply(this, arguments);
  }, {
    apiURLKey: 'custom_api_url',
    getRevenueByItemForDateRange: function(startTime, endTime) {
      var opts = {
        start_time: startTime.valueOf(),
        end_time: endTime.valueOf()
      };
      return this.makeRequest('revenue-by-item', opts);
    }
  });

  return new CustomService();
});