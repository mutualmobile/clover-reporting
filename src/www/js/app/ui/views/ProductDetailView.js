define(function(require) {
  var DetailView = require('./DetailView'),
      Collection = require('lavaca/mvc/Collection'),
      FilteredRevenueOverTimeView = require('app/ui/views/FilteredRevenueOverTimeView'),
      FilteredRevenueOverTimeFullView = require('app/ui/views/FilteredRevenueOverTimeFullView'),
      SmallRevenueByEmployeeView = require('app/ui/views/SmallRevenueByEmployeeView');

  require('rdust!templates/detail');

  /**
   * Employee Detail View
   * @class app.ui.views.EmployeeDetailView
   * @extends app.ui.views.DetailView
   */
  var EmployeeDetailView = DetailView.extend(function() {
    DetailView.apply(this, arguments);
    this.mapChildView({
      '.revenue-by-category': {
        TView: SmallRevenueByEmployeeView,
        model: new Collection(this.model.get('employees'))
      },
      '.bar-chart': {
        TView: FilteredRevenueOverTimeView,
        model: new Collection(this.model.get('orders'))
      },
      '.bar-chart-full': {
        TView: FilteredRevenueOverTimeFullView,
        model: new Collection(this.model.get('orders'))
      }
    });
    this.render();
  });

  return EmployeeDetailView;

});