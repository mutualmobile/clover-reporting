define(function(require) {
  var CollectionDetailView = require('app/ui/collections/detail/CollectionDetailView'),
      RevenueByCategoryModel = require('app/models/chart/RevenueByCategoryModel'),
      RevenueOverTimeModel = require('app/models/chart/RevenueOverTimeModel');

  /**
   * Employee Collection Detail View
   * @class app.ui.collections.detail.EmployeeCollectionDetailView
   * @extends app.ui.collections.detail.CollectionDetailView
   */
  var EmployeeCollectionDetailView = CollectionDetailView.extend(function EmployeeCollectionDetailView() {
    CollectionDetailView.apply(this, arguments);

    var name = this.model.get('name'), // employeeId not provided, for now
        revenueOverTimeModel = new RevenueOverTimeModel({employeeName: name}),
        revenueByCategoryModel = new RevenueByCategoryModel({employeeName: name});
    this.mapDetailViews(revenueOverTimeModel, revenueByCategoryModel);
  });

  return EmployeeCollectionDetailView;

});