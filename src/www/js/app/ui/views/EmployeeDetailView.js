define(function(require) {
  var DetailView = require('./DetailView'),
      Collection = require('lavaca/mvc/Collection'),
      recentOrdersCollection = require('app/models/RecentOrdersCollection'),
      FilteredRevenueOverTimeView = require('app/ui/views/FilteredRevenueOverTimeView'),
      RevenueByCategoryView = require('app/ui/views/RevenueByCategoryView'),
      SmallRevenueByCategoryView = require('app/ui/views/SmallRevenueByCategoryView'),
      FilteredRevenueOverTimeFullView = require('app/ui/views/FilteredRevenueOverTimeFullView'),
      MetricsDetailView = require('app/ui/views/MetricsDetailView'),
      debounce = require('app/misc/debounce');

  /**
   * Employee Detail View
   * @class app.ui.views.EmployeeDetailView
   * @extends app.ui.views.DetailView
   */
  var EmployeeDetailView = DetailView.extend(function EmployeeDetailView() {
    DetailView.apply(this, arguments);
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
        change: debounce(_onChange, this, 0)
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

  return EmployeeDetailView;

});