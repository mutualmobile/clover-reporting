define(function(require) {
  var BaseView = require('app/ui/BaseView'),
      batchCalls = require('app/misc/batch_calls'),
      stateModel = require('app/models/global/StateModel');

  var BaseDataView = BaseView.extend(function BaseDataView() {
    BaseView.apply(this, arguments);

    this._dataChangeHandler = batchCalls(this.onDataChange, this);
    this.mapEvent({
      model: {
        'change.data': this._dataChangeHandler
      }
    });
    stateModel.on('change', 'dataStatus', this._dataChangeHandler);
  }, {
    onDataChange: function() {
      // No-op. Override in subclasses
    },
    dispose: function() {
      var model = this.model;
      stateModel.off('change', this._dataChangeHandler);
      BaseView.prototype.dispose.apply(this, arguments);
      if (model && model.dispose) {
         // BaseDataModels should be disposed to
         // release their DataHandler
        model.dispose();
      }
    }
  });

  return BaseDataView;
});