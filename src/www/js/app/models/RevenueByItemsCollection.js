define(function(require) {
  var Collection = require('lavaca/mvc/Collection'),
      CustomService = require('app/data/CustomService'),
      timeRangeModel = require('app/models/TimeRangeModel');

  var RevenueByItemsCollection = Collection.extend(function RevenueByItemsCollection() {
    Collection.apply(this, arguments);
    _fetch.call(this);
    this.set('loading', true);
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
    this._lastFetch = CustomService.getRevenueByItemForDateRange(startTime, endTime)
      .then(function(data, hash) {
        if (data) {
          if (!this._lastHash || this._lastHash !== hash) {
            this.clearModels();
            this.add(data);
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

  return new RevenueByItemsCollection();
});