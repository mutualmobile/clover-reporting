define(function(require) {
  var BaseDataModel = require('app/models/data/BaseDataModel'),
      sumLineItems = require('app/data/operations/sumLineItems');

  var ProductDetailMetricsModel = BaseDataModel.extend(function ProductDetailMetricsModel() {
    BaseDataModel.apply(this, arguments);
    this.addDataOperation(_dataOperation);
  });

  function _dataOperation(handle) {
    var id = this.get('id');
    sumLineItems(handle)
      .process(function(counts) {
        var result = [],
            max = 0,
            total = 0;
        for (var id in counts) {
          result.push({
            id: id,
            name: counts[id].name,
            total: counts[id].total
          });
          total += counts[id].total;
          max = Math.max(max, counts[id].total);
        }
        result.forEach(function(item) {
          item.percentOfTotal = item.total / total;
          item.percentOfMax = item.total / max;
        });
        return result;
      })
      .filter(function(item, id) {
        return item.id === id;
      }, id)
      .process(function(arr) {
        return arr[0];
      });
  }

  return ProductDetailMetricsModel;
});