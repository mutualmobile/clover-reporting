define(function(require) {
  var Service = require('app/service/Service');

  var CloverService = Service.extend(function CloverService() {
    Service.apply(this, arguments);
  }, {
    defaultAjaxOptions: {
      contentType: 'application/json',
    }
  });

  return new CloverService();
});