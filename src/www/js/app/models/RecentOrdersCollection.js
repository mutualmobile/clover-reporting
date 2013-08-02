define(function(require) {
  var Collection = require('lavaca/mvc/Collection'),
      Promise = require('lavaca/util/Promise'),
      OrdersService = require('app/data/OrdersService');

  var RecentOrdersCollection = Collection.extend(function RecentOrdersCollection() {
    Collection.apply(this, arguments);
    _fetch.call(this);
  });

  function _fetch() {
    OrdersService.getOrdersForToday().then(function(data) {
      this.clearModels();
      if (data && data.orders && data.orders.length) {
        this.add(data.orders);
      } else {
        this.set('empty', true);
      }
    }.bind(this));
  }

  return RecentOrdersCollection;
});