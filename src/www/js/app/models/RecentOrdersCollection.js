define(function(require) {
  var Collection = require('lavaca/mvc/Collection'),
      OrdersService = require('app/data/OrdersService'),
      timeRangeModel = require('app/models/TimeRangeModel');

  var RecentOrdersCollection = Collection.extend(function RecentOrdersCollection() {
    Collection.apply(this, arguments);
    _fetch.call(this);
    this.set('loading', true);
    this.apply({
      totalRevenue: _totalRevenue
    });

    this._externalBoundHandler = _fetch.bind(this);
    timeRangeModel.on('rangeUpdate', this._externalBoundHandler);
  }, {
    dispose: function() {
      timeRangeModel.off('rangeUpdate', this._externalBoundHandler);
      return Collection.prototype.dispose.apply(this, arguments);
    }
  });

  // Private functions
  function _fetch() {
    var startTime = timeRangeModel.get('startTime'),
        endTime = timeRangeModel.get('endTime');

    clearTimeout(this._fetchTimeout);
    if (this._lastFetch) {
      this._lastFetch.reject('abort');
    }

    this.set('startTime', startTime);
    this.set('endTime', endTime);
    this._lastFetch = OrdersService.getOrdersForDateRange(startTime, endTime)
      .then(function(data, hash) {
        if (data && data.orders) {
          if (!this._lastHash || this._lastHash !== hash) {
            this.clearModels();
            this.add(data.orders);
            this._lastHash = hash;
          }
        }
        this.set('error', false);
      }.bind(this), function(error) {
        if (error !== 'abort') {
          this.set('error', true);
        }
      }.bind(this))
      .always(function() {
        this.set('loading', false);
        this._fetchTimeout = setTimeout(_fetch.bind(this), 5000);
      }.bind(this));
  }

  // Computed Properties
  function _totalRevenue() {
    var total = 0;
    this.each(function(index, order) {
      total += order.get('total');
    });
    return total;
  }

  return new RecentOrdersCollection();
});