define(function(require) {
  var BaseDataView = require('app/ui/BaseDataView');

  var DetailSalesView = BaseDataView.extend(function DetailSalesView() {
    BaseDataView.apply(this, arguments);
  });

  return DetailSalesView;
});