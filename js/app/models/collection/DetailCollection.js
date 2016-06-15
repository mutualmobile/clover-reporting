define(function(require) {
  var BaseDataCollection = require('app/models/data/BaseDataCollection'),
      DetailMetricsModel = require('app/models/collection/DetailMetricsModel');

  var DetailCollection = BaseDataCollection.extend(function DetailCollection() {
    BaseDataCollection.apply(this, arguments);
    this.addDataOperation(_dataOperation);
  }, {
    TModel: DetailMetricsModel,
    onDataChange: function(data) {
      BaseDataCollection.prototype.onDataChange.call(this, data.items);
    },
    sumOperation: function() {}
  });

  function _dataOperation(handle) {
    this.sumOperation(handle);
    handle.process(function(data) {
      data.items.sort(function(a, b) {
        return b.total - a.total;
      });
      return data;
    });
  }

  return DetailCollection;
});