define(function(require) {
  var BaseView = require('app/ui/BaseView');
  // var CollectionDetailView = require('app/ui/collections/detail/CollectionDetailView'),
  //     Collection = require('lavaca/mvc/Collection'),
  //     FilteredRevenueOverTimeView = require('app/ui/charts/chronological/FilteredRevenueOverTimeView'),
  //     FilteredRevenueOverTimeFullView = require('app/ui/charts/chronological/FilteredRevenueOverTimeFullView'),
  //     SmallFilteredRevenueByEmployeeView = require('app/ui/charts/pie/SmallFilteredRevenueByEmployeeView'),
  //     FilteredRevenueByEmployeeView = require('app/ui/charts/pie/FilteredRevenueByEmployeeView'),
  //     MetricsDetailView = require('app/ui/metrics/MetricsDetailView'),
  //     batchCalls = require('app/misc/batch_calls');

  // require('rdust!templates/detail');

  /**
   * Product Collection Detail View
   * @class app.ui.collections.detail.ProductCollectionDetailView
   * @extends app.ui.collections.detail.CollectionDetailView
   */
  var ProductCollectionDetailView = BaseView.extend(function ProductCollectionDetailView() {
    BaseView.apply(this, arguments);
  });

  return ProductCollectionDetailView;

});