define(function (require) {
  var DetailCollection = require('app/models/collection/DetailCollection'),
      sumByItem = require('app/data/operations/sumByItem');

  var ProductsCollection = DetailCollection.extend(function ProductsCollection() {
    DetailCollection.apply(this, arguments);
  }, {
    sumOperation: sumByItem
  });

  return ProductsCollection;
});