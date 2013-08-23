define(function(require) {
  var DetailView = require('./DetailView'),
      Collection = require('lavaca/mvc/Collection'),
      FilteredRevenueOverTimeView = require('app/ui/views/FilteredRevenueOverTimeView'),
      FilteredRevenueOverTimeFullView = require('app/ui/views/FilteredRevenueOverTimeFullView'),
      SmallFilteredRevenueByEmployeeView = require('app/ui/views/SmallFilteredRevenueByEmployeeView'),
      FilteredRevenueByEmployeeView = require('app/ui/views/FilteredRevenueByEmployeeView'),
      MetricsDetailView = require('app/ui/views/MetricsDetailView'),
      debounce = require('app/misc/debounce');

  require('rdust!templates/detail');

  /**
   * Employee Detail View
   * @class app.ui.views.EmployeeDetailView
   * @extends app.ui.views.DetailView
   */
  var EmployeeDetailView = DetailView.extend(function ProductDetailView() {
    DetailView.apply(this, arguments);
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
    var employeesCollection = new Collection(this.model.get('employees')),
        ordersCollection = new Collection(this.model.get('orders'));
    this.childViewMap['.revenue-by-category'].model = employeesCollection;
    this.childViewMap['.bar-chart .inner'].model = ordersCollection;
    this.childViewMap['.bar-chart-full'].model = ordersCollection;
    this.childViewMap['.pie-detail'].model = employeesCollection;
  }

  return EmployeeDetailView;

});