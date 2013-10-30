define(function(require) {
  var dataHub = require('app/data/DataHub'),
      stateModel = require('app/models/StateModel'),
      Model = require('lavaca/mvc/Model');

  var BaseDataModel = Model.extend(function BaseDataModel() {
    Model.apply(this, arguments);

    // Add individual properties based on the dataStatus
    // property of the stateModel
    _setStatusProperties.call(this);
    this._statusChangeHandler = _setStatusProperties.bind(this);
    stateModel.on('change', 'dataStatus', this._statusChangeHandler);

    // Add a done handler to the DatHandle that will set
    // the returned data to the 'data' property
    this._dataHandle = dataHub.createDataHandle().done(function(data) {
      this.set('data', data);
    }.bind(this));
  }, {
    map: function() {
      this._dataHandle.map.apply(this._dataHandle, arguments);
      return this;
    },
    reduce: function() {
      this._dataHandle.reduce.apply(this._dataHandle, arguments);
      return this;
    },
    dispose: function() {
      this._dataHandle.dispose();
      stateModel.off(this._statusChangeHandler);
      return Model.dispose.apply(this, arguments);
    }
  });

  // Private functions
  function _setStatusProperties() {
    var dataStatus = stateModel.get('dataStatus');
    this.set('ready', dataStatus === 'ready');
    this.set('error', dataStatus === 'error');
    this.set('loading', dataStatus === 'loading');
  }

  return BaseDataModel;
});