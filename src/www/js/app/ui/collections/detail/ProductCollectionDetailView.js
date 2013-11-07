define(function(require) {
  var CollectionDetailView = require('app/ui/collections/detail/CollectionDetailView'),
      DetailMetricsView = require('app/ui/collections/overview/DetailMetricsView'),
      ProductDetailMetricsModel = require('app/models/collection/overview/ProductDetailMetricsModel'),
      SmallRevenueByEmployeeView = require('app/ui/charts/pie/SmallRevenueByEmployeeView'),
      RevenueByEmployeeModel = require('app/models/chart/RevenueByEmployeeModel');

  /**
   * Product Collection Detail View
   * @class app.ui.collections.detail.ProductCollectionDetailView
   * @extends app.ui.collections.detail.CollectionDetailView
   */
  var ProductCollectionDetailView = CollectionDetailView.extend(function ProductCollectionDetailView() {
    CollectionDetailView.apply(this, arguments);

    var id = this.model.get('id');
    this.mapChildView({
      '.overview': {
        TView: DetailMetricsView,
        model: new ProductDetailMetricsModel({id: id})
      },
      '.revenue-by-category': {
        TView: SmallRevenueByEmployeeView,
        model: new RevenueByEmployeeModel({itemId: id})
      },
      // '.bar-chart .inner': {
      //   TView: FilteredRevenueOverTimeView
      // },
      // '.bar-chart-full': {
      //   TView: FilteredRevenueOverTimeFullView
      // },
      // '.metrics': {
      //   TView: MetricsDetailView
      // },
      // '.pie-detail': {
      //   TView: FilteredRevenueByEmployeeView
      // }
    });
  });

  return ProductCollectionDetailView;

});