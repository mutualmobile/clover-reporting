define(function(require) {
  var Collection = require('lavaca/mvc/Collection'),
      dataOperationMixin = require('app/models/data/dataOperationMixin');

  var BaseDataCollection = Collection.extend(function BaseDataCollection() {
    Collection.apply(this, arguments);
    this.setupDataHandling();
  }, dataOperationMixin(Collection));

  return BaseDataCollection;
});