define(function(require) {

  var Service = require('app/service/Service'),
      localStore = require('app/cache/localStore');

  var CustomService = Service.extend(function CustomService() {
    Service.apply(this, arguments);
  }, {
    apiURLKey: 'custom_api_url',
    getOrdersForDateRange: function(startTime, endTime) {
      return _makeRequest.call(this, startTime, endTime, 'orders');
    },
    getRevenueByItemForDateRange: function(startTime, endTime) {
      return _makeRequest.call(this, startTime, endTime, 'revenue-by-item');
    },
    getRevenueByCategoryForDateRange: function(startTime, endTime) {
      return _makeRequest.call(this, startTime, endTime, 'revenue-by-category');
    },
    getEmployeeDataForDateRange: function(startTime, endTime) {
      return _makeRequest.call(this, startTime, endTime, 'employee-data');
    },
    getProductDataForDateRange: function(startTime, endTime) {
      return _makeRequest.call(this, startTime, endTime, 'product-data');
    },
    defaultAjaxOptions: {
      beforeSend: function(xhr) {
        var merchantId = localStore.get('merchantId'),
            accessToken = localStore.get('accessToken');

        xhr.setRequestHeader('x-clover-merchant-id', merchantId);
        xhr.setRequestHeader('x-clover-access-token', accessToken);
      }
    }
  });

  function _makeRequest(startTime, endTime, url) {
    var opts = {
      start_time: startTime.valueOf(),
      end_time: endTime.valueOf()
    };
    return this.makeRequest(url, opts);
  }

  return new CustomService();
});