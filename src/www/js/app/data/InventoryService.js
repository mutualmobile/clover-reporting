define(function(require) {

  var Service = require('app/data/Service');

  var InventoryService = Service.extend(function InventoryService() {
    Service.apply(this, arguments);
  });

  return new InventoryService();
});