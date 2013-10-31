define(function(require) {
  var CollectionDetailView = require('app/ui/collections/detail/CollectionDetailView'),
      Collection = require('lavaca/mvc/Collection'),
      FilteredRevenueOverTimeView = require('app/ui/charts/chronological/FilteredRevenueOverTimeView'),
      FilteredRevenueOverTimeFullView = require('app/ui/charts/chronological/FilteredRevenueOverTimeFullView'),
      SmallFilteredRevenueByEmployeeView = require('app/ui/charts/pie/SmallFilteredRevenueByEmployeeView'),
      FilteredRevenueByEmployeeView = require('app/ui/charts/pie/FilteredRevenueByEmployeeView'),
      MetricsDetailView = require('app/ui/metrics/MetricsDetailView'),
      batchCalls = require('app/misc/batch_calls');

  require('rdust!templates/detail');

  /**
   * Product Collection Detail View
   * @class app.ui.collections.detail.ProductCollectionDetailView
   * @extends app.ui.collections.detail.CollectionDetailView
   */
  var ProductCollectionDetailView = CollectionDetailView.extend(function ProductCollectionDetailView() {
    CollectionDetailView.apply(this, arguments);
    this.mapChildView({
      '.revenue-by-category': {
        TView: SmallFilteredRevenueByEmployeeView,
        // dynamic model in _updateChildViewModels
      },
      '.bar-chart .inner': {
        TView: FilteredRevenueOverTimeView,
        // dynamic model in _updateChildViewModels
      },
      '.bar-chart-full': {
        TView: FilteredRevenueOverTimeFullView,
        // dynamic model in _updateChildViewModels
      },
      '.metrics': {
        TView: MetricsDetailView
      },
      '.pie-detail': {
        TView: FilteredRevenueByEmployeeView,
        // dynamic model in _updateChildViewModels
      }
    });
    _updateChildViewModels.call(this);

    this.mapEvent({
      model: {
        change: batchCalls(_onChange, this)
      }
    });
    this.render();
  });

  // Event handlers
  function _onChange() {
    _updateChildViewModels.call(this);
    this.redraw();
  }

  // Private functions
  function _updateChildViewModels() {
    var employeesCollection = new Collection(this.model.get('employees')),
        ordersCollection = new Collection(this.model.get('orders'));
    this.childViewMap['.revenue-by-category'].model = employeesCollection;
    this.childViewMap['.bar-chart .inner'].model = ordersCollection;
    this.childViewMap['.bar-chart-full'].model = ordersCollection;
    this.childViewMap['.pie-detail'].model = employeesCollection;
  }

  return ProductCollectionDetailView;

});