define(function(require) {
  var Model = require('lavaca/mvc/Model'),
      dataOperationMixin = require('app/models/data/dataOperationMixin');

  var BaseDataModel = Model.extend(function BaseDataModel() {
    Model.apply(this, arguments);
    this.setupDataHandling();
  }, dataOperationMixin(Model));

  return BaseDataModel;
});