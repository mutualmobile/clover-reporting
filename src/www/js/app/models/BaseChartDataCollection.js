define(function(require) {
  var Collection = require('lavaca/mvc/Collection'),
      timeRangeModel = require('app/models/TimeRangeModel'),
      clone = require('mout/lang/clone'),
      remove = require('mout/array/remove');

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
    applyNewData: function(data) {
      var models;
      if (!data.length || !data[0].id) {
        this.clearModels();
        this.add(data);
      } else {
        models = clone(this.models);

        // Update existing items and
        // add new items
        data.forEach(function(item) {
          var current;
          if (item.id) {
            current = this.first({id: item.id});
            if (current) {
              current.apply(item);
              remove(models, current);
            } else {
              this.add(item);
            }
          }
        }.bind(this));

        // Remove old items
        models.forEach(function(model) {
          this.remove(model);
        }.bind(this));

        // Re-arrange
        data.forEach(function(item, index) {
          var match = this.first({id: item.id}),
              currentIndex;
          if (match) {
            currentIndex = this.models.indexOf(match);
            if (currentIndex !== index) {
              this.moveTo(currentIndex, index);
            }
          }
        }.bind(this));
      }
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
            this.applyNewData(data);
            this.trigger('dataChange');
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