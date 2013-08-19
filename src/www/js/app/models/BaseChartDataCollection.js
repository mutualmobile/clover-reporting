define(function(require) {
  var Collection = require('lavaca/mvc/Collection'),
      timeRangeModel = require('app/models/TimeRangeModel');

  var BaseChartDataCollection = Collection.extend(function BaseChartDataCollection() {
    Collection.apply(this, arguments);
    _fetch.call(this);
    this.apply({
      loading: true,
      startTime: timeRangeModel.get('startTime'),
      endTime: timeRangeModel.get('endTime')
    });
    this._externalBoundHandler = _fetch.bind(this);
    timeRangeModel.on('rangeUpdate', this._externalBoundHandler);
  }, {
    fetch: null,
    fetchDelay: 10000,
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
    this._lastFetch = this.fetch(startTime, endTime)
      .then(function(data, hash) {
        if (data) {
          if (!this._lastHash || this._lastHash !== hash) {
            this.clearModels();
            this.add(data);
            this._lastHash = hash;
          }
        }
        this.set('startTime', startTime);
        this.set('endTime', endTime);
        this.set('error', false);
      }.bind(this), function(error) {
        if (error !== 'abort') {
          this.set('error', true);
        }
      }.bind(this))
      .always(function() {
        this.set('loading', false);
        this._fetchTimeout = setTimeout(_fetch.bind(this), this.fetchDelay);
      }.bind(this));
  }

  return BaseChartDataCollection;
});