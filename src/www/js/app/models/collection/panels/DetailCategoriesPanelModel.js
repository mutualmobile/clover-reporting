define(function(require) {
  var BaseDataModel = require('app/models/data/BaseDataModel');

  var DetailCategoriesPanelModel = BaseDataModel.extend(function DetailCategoriesPanelModel() {
    BaseDataModel.apply(this, arguments);
  });

  return DetailCategoriesPanelModel;
});