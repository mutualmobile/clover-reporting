define(function(require) {
  var CollectionDetailView = require('app/ui/collections/detail/CollectionDetailView'),
      Collection = require('lavaca/mvc/Collection'),
      recentOrdersCollection = require('app/models_old/RecentOrdersCollection'),
      FilteredRevenueOverTimeView = require('app/ui/charts/chronological/FilteredRevenueOverTimeView'),
      RevenueByCategoryView = require('app/ui/charts/pie/RevenueByCategoryView'),
      SmallRevenueByCategoryView = require('app/ui/charts/pie/SmallRevenueByCategoryView'),
      FilteredRevenueOverTimeFullView = require('app/ui/charts/chronological/FilteredRevenueOverTimeFullView'),
      MetricsDetailView = require('app/ui/metrics/MetricsDetailView'),
      batchCalls = require('app/misc/batch_calls');

  /**
   * Employee Detail View
   * @class app.ui.collections.detail.EmployeeCollectionDetailView
   * @extends app.ui.collections.detail.CollectionDetailView
   */
  var EmployeeCollectionDetailView = CollectionDetailView.extend(function EmployeeCollectionDetailView() {
    CollectionDetailView.apply(this, arguments);
    this.mapChildView({
      '.revenue-by-category': {
        TView: SmallRevenueByCategoryView,
        // dynamic model in _updateChildViewModels
      },
      '.bar-chart .inner': {
        TView: FilteredRevenueOverTimeView,
        model: recentOrdersCollection
      },
      '.bar-chart-full': {
        TView: FilteredRevenueOverTimeFullView,
        model: recentOrdersCollection
      },
      '.metrics': {
        TView: MetricsDetailView
      },
      '.pie-detail': {
        TView: RevenueByCategoryView
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
    var revenueByCategoryCollection = new Collection(this.model.get('revenueByCategory'));
    this.childViewMap['.pie-detail'].model = revenueByCategoryCollection;
    this.childViewMap['.revenue-by-category'].model = revenueByCategoryCollection;
  }

  return EmployeeCollectionDetailView;

});