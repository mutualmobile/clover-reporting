define(function(require) {
  var Collection = require('lavaca/mvc/Collection'),
      OrdersService = require('app/data/OrdersService'),
      moment = require('moment');

  var RecentOrdersCollection = Collection.extend(function RecentOrdersCollection() {
    Collection.apply(this, arguments);
    _fetch.call(this);
    this.set('loading', true);
    this.apply({
      totalRevenue: _totalRevenue
    });
  });

  // Private functions
  function _fetch() {
    var startTime = moment().subtract('days', 1),
        endTime = moment();
    this.set('startTime', startTime);
    this.set('endTime', endTime);
    OrdersService.getOrdersForDateRange(startTime, endTime)
      .then(function(data, hash) {
        if (data && data.orders && data.orders.length) {
          if (!this._lastHash || this._lastHash !== hash) {
            this.clearModels();
            this.add(data.orders);
            this._lastHash = hash;
          }
        }
        this.set('error', false);
      }.bind(this), function() {
        this.set('error', true);
      }.bind(this))
      .always(function() {
        this.set('loading', false);
        setTimeout(_fetch.bind(this), 5000);
      }.bind(this));
  }

  // Computed Properties
  function _totalRevenue() {
    var total = 0;
    this.each(function(index, order) {
      total += order.get('paid');
    });
    return total;
  }

  return new RecentOrdersCollection();
});