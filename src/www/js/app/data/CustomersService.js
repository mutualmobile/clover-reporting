define(function(require) {

  var Service = require('app/data/Service');

  var CustomerService = Service.extend(function CustomerService() {
    Service.apply(this, arguments);
  });

  return new CustomerService();
});