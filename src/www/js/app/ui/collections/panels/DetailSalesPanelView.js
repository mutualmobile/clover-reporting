define(function(require) {
  var BaseDataView = require('app/ui/BaseDataView');

  var DetailSalesPanelView = BaseDataView.extend(function DetailSalesPanelView() {
    BaseDataView.apply(this, arguments);
  });

  return DetailSalesPanelView;
});