define(function(require) {
  var BaseDataModel = require('app/models/BaseDataModel');

  var BaseMetricsModel = BaseDataModel.extend(function BaseMetricsModel() {
    BaseDataModel.apply(this, arguments);
  }, {
    addMetric: function(name, dataOperation) {
      if (typeof name === 'object') {
        for (var key in name) {
          this.addMetric(key, name[key]);
        }
      } else {
        this.addDataOperation(function(handle) {
          dataOperation.call(this, handle);
          handle.done(function(data) {
            this.set(name, data);
          }.bind(this));
        });
      }
    }
  });

  return BaseMetricsModel;
});