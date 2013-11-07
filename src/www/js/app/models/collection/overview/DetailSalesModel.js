define(function(require) {
  var BaseDataModel = require('app/models/data/BaseDataModel');

  var DetailSalesModel = BaseDataModel.extend(function DetailSalesModel() {
    BaseDataModel.apply(this, arguments);
  });

  return DetailSalesModel;
});