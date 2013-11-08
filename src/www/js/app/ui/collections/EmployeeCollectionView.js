define(function(require) {

  var BaseCollectionView = require('app/ui/collections/BaseCollectionView'),
      EmployeeDetailView = require('app/ui/collections/detail/EmployeeCollectionDetailView');

  /**
   * A collection of EmployeeDetailViews
   * @class app.ui.collections.EmployeeCollectionView
   * @super app.ui.collections.BaseCollectionView
   */
  var EmployeeCollectionView = BaseCollectionView.extend(function EmployeeCollectionView() {
    BaseCollectionView.apply(this, arguments);
  },{
    TView: EmployeeDetailView
  });

  return EmployeeCollectionView;

});