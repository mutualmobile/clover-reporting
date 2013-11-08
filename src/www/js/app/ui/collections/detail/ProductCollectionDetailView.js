define(function(require) {
  var CollectionDetailView = require('app/ui/collections/detail/CollectionDetailView'),
      DetailMetricsView = require('app/ui/collections/detail/child/DetailMetricsView'),
      ProductDetailMetricsModel = require('app/models/collection/overview/ProductDetailMetricsModel'),
      SmallRevenueByEmployeeView = require('app/ui/charts/pie/SmallRevenueByEmployeeView'),
      RevenueByEmployeeModel = require('app/models/chart/RevenueByEmployeeModel'),
      SmallRevenueOverTimeBarView = require('app/ui/charts/time/SmallRevenueOverTimeBarView'),
      RevenueOverTimeModel = require('app/models/chart/RevenueOverTimeModel'),
      RevenueOverTimeBarView = require('app/ui/charts/time/RevenueOverTimeBarView'),
      DetailCategoriesPanelView = require('app/ui/collections/detail/child/DetailCategoriesPanelView'),
      DetailMetricsPanelView = require('app/ui/collections/detail/child/DetailMetricsPanelView');

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
    this.mapChildView({
      '.overview': {
        TView: DetailMetricsView
      },
      '.revenue-by-category': {
        TView: SmallRevenueByEmployeeView,
        model: revenueByEmployeeModel
      },
      '.bar-chart .inner': {
        TView: SmallRevenueOverTimeBarView,
        model: revenueOverTimeModel
      },
      '.bar-chart-full': {
        TView: RevenueOverTimeBarView,
        model: revenueOverTimeModel
      },
      '.metrics': {
        TView: DetailMetricsPanelView
      },
      '.pie-chart-full': {
        TView: DetailCategoriesPanelView,
        model: revenueByEmployeeModel
      }
    });
  });

  return ProductCollectionDetailView;

});