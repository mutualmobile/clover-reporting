define(function(require) {
  var CollectionDetailView = require('app/ui/collections/detail/CollectionDetailView'),
      RevenueByItemModel = require('app/models/chart/RevenueByItemModel'),
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
        revenueByItemModel = new RevenueByItemModel({employeeName: name});
    this.mapDetailViews(revenueOverTimeModel, revenueByItemModel);
  });

  return EmployeeCollectionDetailView;

});