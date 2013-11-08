define(function (require) {
  var BaseDataCollection = require('app/models/data/BaseDataCollection'),
      ProductMetricsModel = require('app/models/collection/ProductMetricsModel'),
      sumByItem = require('app/data/operations/sumByItem'),
      pick = require('mout/object/pick');

  var ProductsCollection = BaseDataCollection.extend(function ProductsCollection() {
    BaseDataCollection.apply(this, arguments);
    this.addDataOperation(_dataOperation);
  }, {
    TModel: ProductMetricsModel,
    onDataChange: function(data) {
      this.apply(pick(data, 'time', 'total', 'max'));
      BaseDataCollection.prototype.onDataChange.call(this, data.items);
    }
  });

  function _dataOperation(handle) {
    sumByItem(handle);
    handle.process(function(data) {
      data.items.sort(function(a, b) {
        return b.total - a.total;
      });
      return data;
    });
  }

  return ProductsCollection;
});