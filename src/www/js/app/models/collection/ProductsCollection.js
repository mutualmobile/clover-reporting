define(function (require) {
  var BaseDataCollection = require('app/models/data/BaseDataCollection'),
      sumLineItems = require('app/data/operations/sumLineItems');

  var ProductsCollection = BaseDataCollection.extend(function ProductsCollection() {
    BaseDataCollection.apply(this, arguments);
    this.addDataOperation(_dataOperation);
  });

  function _dataOperation(handle) {
    sumLineItems(handle)
      .process(function(counts) {
        var result = [];
        for (var id in counts) {
          result.push({
            id: id,
            total: counts[id].total
          });
        }
        return result;
      })
      .sort(function(a, b) {
        return b.total - a.total;
      })
      .map(function(item) {
        return {id: item.id};
      });
  }

  return ProductsCollection;
});