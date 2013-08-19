define(function(require) {

  var CollectionView = require('app/ui/views/CollectionView'),
      EmployeeDetailView = require('app/ui/views/EmployeeDetailView');

  /**
   * A collection of EmployeeDetailViews
   * @class app.ui.views.EmployeeCollectionView
   * @super app.ui.views.CollectionView
   */
  var EmployeeCollectionView = CollectionView.extend(function EmployeeCollectionView() {
    CollectionView.apply(this, arguments);
    this.render();
  },{
    TView: EmployeeDetailView
  });

  return EmployeeCollectionView;

});