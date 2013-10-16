define(function(require) {

  var BaseCollectionView = require('app/ui/views/BaseCollectionView'),
      EmployeeDetailView = require('app/ui/views/EmployeeDetailView');

  /**
   * A collection of EmployeeDetailViews
   * @class app.ui.views.EmployeeCollectionView
   * @super app.ui.views.BaseCollectionView
   */
  var EmployeeCollectionView = BaseCollectionView.extend(function EmployeeCollectionView() {
    BaseCollectionView.apply(this, arguments);
    this.render();
  },{
    TView: EmployeeDetailView
  });

  return EmployeeCollectionView;

});