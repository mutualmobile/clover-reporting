define(function(require) {
  var Model = require('lavaca/mvc/Model'),
      mixIn = require('mout/object/mixIn'),
      dataOperationMixin = require('app/models/data/dataOperationMixin');

  var BaseDataModel = Model.extend(function BaseDataModel() {
    Model.apply(this, arguments);
    this.set('data', []);
    this.setupDataHandling();
  }, mixIn(dataOperationMixin(Model), {
    onDataChange: function(data) {
      this.set('data', data);
    }
  }));

  return BaseDataModel;
});