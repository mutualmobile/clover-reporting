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
    fetchDelay: 5000,
    bucketData: function(start, end, ticks, bucketAttr, sumAttr, filter) {
      var buckets = [],
          filteredItems = filter ? this.filter(filter) : this.models,
          getBucketVal,
          getSumVal;

      ticks = [start].concat(ticks);

      ticks.forEach(function(tick, i) {
        buckets.push([
          tick + (((ticks[i+1] || end) - tick) / 2),
          0
        ]);
      });

      if (typeof bucketAttr === 'string') {
        getBucketVal = function(model) {
          return model.get(bucketAttr);
        };
      } else {
        getBucketVal = bucketAttr;
      }
      if (typeof sumAttr === 'string') {
        getSumVal = function(model) {
          return model.get(sumAttr);
        };
      } else {
        getSumVal = sumAttr;
      }

      filteredItems.forEach(function(model) {
        ticks.some(function(tick, i) {
          var bucketVal = getBucketVal(model);
          if (bucketVal > tick && bucketVal < (ticks[i+1] || end)) {
            buckets[i][1] += getSumVal(model);
          }
        });
      });

      return buckets;
    },
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
        var currentStartTime = this.get('startTime'),
            currentEndTime = this.get('endTime');
        if (data) {
          if (!this._lastHash || this._lastHash !== hash) {
            this.clearModels();
            this.add(data);
            this._lastHash = hash;
          }
        }
        if (!currentStartTime || currentStartTime.valueOf() !== startTime.valueOf()) {
          this.set('startTime', startTime);
        }
        if (!currentEndTime || currentEndTime.valueOf() !== endTime.valueOf()) {
          this.set('endTime', endTime);
        }
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