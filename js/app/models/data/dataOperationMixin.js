define(function(require) {
  var dataHub = require('app/data/dataHub');

  var dataOperationMixin = function(TSuper) {
    return {
      setupDataHandling: function() {
        this._dataHandles = [];
      },
      onDataChange: function(data) {},
      setPrimaryDataHandle: function(handle) {
        handle.done(this.onDataChange.bind(this));
      },
      addDataOperation: function(callbacks, fireOnDataChange) {
        callbacks = Array.isArray(callbacks) ? callbacks : [callbacks];
        callbacks.forEach(function(cb) {
          var handle = dataHub.createDataHandle();
          cb.call(this, handle);
          if (fireOnDataChange !== false) {
            handle.done(this.onDataChange.bind(this));
          }
          this._dataHandles.push(handle);
        }.bind(this));
      },
      dispose: function() {
        // In case this gets called twice, for example,
        // if the model is shared by multiple views that
        // are getting disposed at the same time
        if (!this._hasBeenDisposed) {
          this._dataHandles.forEach(function(handle) {
            handle.dispose();
          });
          this._hasBeenDisposed = true;
        }
        TSuper.prototype.dispose.apply(this, arguments);
      }
    };
  };

  return dataOperationMixin;
});