define(function(require) {
  var BaseDataModel = require('app/models/data/BaseDataModel');

  var DetailMetricsPanelModel = BaseDataModel.extend(function DetailMetricsPanelModel() {
    BaseDataModel.apply(this, arguments);
  });

  return DetailMetricsPanelModel;
});