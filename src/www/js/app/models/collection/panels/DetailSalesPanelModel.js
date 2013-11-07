define(function(require) {
  var BaseDataModel = require('app/models/data/BaseDataModel');

  var DetailSalesPanelModel = BaseDataModel.extend(function DetailSalesPanelModel() {
    BaseDataModel.apply(this, arguments);
  });

  return DetailSalesPanelModel;
});