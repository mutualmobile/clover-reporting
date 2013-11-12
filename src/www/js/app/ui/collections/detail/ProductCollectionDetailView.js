define(function(require) {
  var CollectionDetailView = require('app/ui/collections/detail/CollectionDetailView'),
      RevenueByEmployeeModel = require('app/models/chart/RevenueByEmployeeModel'),
      RevenueOverTimeModel = require('app/models/chart/RevenueOverTimeModel');

  /**
   * Product Collection Detail View
   * @class app.ui.collections.detail.ProductCollectionDetailView
   * @extends app.ui.collections.detail.CollectionDetailView
   */
  var ProductCollectionDetailView = CollectionDetailView.extend(function ProductCollectionDetailView() {
    CollectionDetailView.apply(this, arguments);

    var id = this.model.get('id'),
        revenueOverTimeModel = new RevenueOverTimeModel({itemId: id}),
        revenueByEmployeeModel = new RevenueByEmployeeModel({itemId: id});
    this.mapDetailViews(revenueOverTimeModel, revenueByEmployeeModel);
  });

  return ProductCollectionDetailView;

});