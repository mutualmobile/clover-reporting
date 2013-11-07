define(function(require) {
  var BaseDataView = require('app/ui/BaseDataView');

  var DetailCategoriesPanelView = BaseDataView.extend(function DetailCategoriesPanelView() {
    BaseDataView.apply(this, arguments);
  });

  return DetailCategoriesPanelView;
});