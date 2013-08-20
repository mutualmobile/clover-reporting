define(function(require) {
  var DetailView = require('./DetailView'),
      Collection = require('lavaca/mvc/Collection'),
      recentOrdersCollection = require('app/models/RecentOrdersCollection'),
      FilteredRevenueOverTimeView = require('app/ui/views/FilteredRevenueOverTimeView'),
      RevenueByCategoryView = require('app/ui/views/RevenueByCategoryView'),
      SmallRevenueByCategoryView = require('app/ui/views/SmallRevenueByCategoryView'),
      FilteredRevenueOverTimeFullView = require('app/ui/views/FilteredRevenueOverTimeFullView');

  /**
   * Employee Detail View
   * @class app.ui.views.EmployeeDetailView
   * @extends app.ui.views.DetailView
   */
  var EmployeeDetailView = DetailView.extend(function() {
    DetailView.apply(this, arguments);
    var revenueByCategoryCollection = new Collection(this.model.get('revenueByCategory'));
    this.mapChildView({
      '.revenue-by-category': {
        TView: SmallRevenueByCategoryView,
        model: revenueByCategoryCollection
      },
      '.bar-chart': {
        TView: FilteredRevenueOverTimeView,
        model: recentOrdersCollection
      },
      '.bar-chart-full': {
        TView: FilteredRevenueOverTimeFullView,
        model: recentOrdersCollection
      },
      '.pie-detail': {
        TView: RevenueByCategoryView,
        model: revenueByCategoryCollection
      }
    });
    this.render();
  });

  return EmployeeDetailView;

});