define(function(require) {
  var dataHub = require('app/data/dataHub'),
      stateModel = require('app/models/global/StateModel');

  var dataOperationMixin = function(TSuper) {
    return {
      setupDataHandling: function() {
        this._dataHandles = [];

        // Add individual properties based on the dataStatus
        // property of the stateModel
        _setStatusProperties.call(this);
        this._statusChangeHandler = _setStatusProperties.bind(this);
        stateModel.on('change', 'dataStatus', this._statusChangeHandler);
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
          stateModel.off(this._statusChangeHandler);
          this._hasBeenDisposed = true;
        }
        TSuper.prototype.dispose.apply(this, arguments);
      }
    };
  };

  // Private functions
  function _setStatusProperties() {
    var dataStatus = stateModel.get('dataStatus');
    this.set('ready', dataStatus === 'ready');
    this.set('error', dataStatus === 'error');
    this.set('loading', dataStatus === 'loading');
  }

  return dataOperationMixin;
});