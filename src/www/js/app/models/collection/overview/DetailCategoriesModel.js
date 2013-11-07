define(function(require) {
  var BaseDataModel = require('app/models/data/BaseDataModel');

  var DetailCategoriesModel = BaseDataModel.extend(function DetailCategoriesModel() {
    BaseDataModel.apply(this, arguments);
  });

  return DetailCategoriesModel;
});