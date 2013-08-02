define(function(require) {

  var Service = require('app/data/Service');

  var PaymentService = Service.extend(function PaymentService() {
    Service.apply(this, arguments);
  });

  return new PaymentService();
});