define(function(require) {
  var BaseDataView = require('app/ui/BaseDataView');

  var DetailCategoriesView = BaseDataView.extend(function DetailCategoriesView() {
    BaseDataView.apply(this, arguments);
  });

  return DetailCategoriesView;
});