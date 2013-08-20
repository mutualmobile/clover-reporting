define(function(require) {
  var BaseView = require('./BaseView'),
      Collection = require('lavaca/mvc/Collection'),
      recentOrdersCollection = require('app/models/RecentOrdersCollection'),
      FilteredRevenueOverTimeView = require('app/ui/views/FilteredRevenueOverTimeView'),
      SmallRevenueByCategoryView = require('app/ui/views/SmallRevenueByCategoryView');

  require('rdust!templates/detail');

  /**
   * Employee Detail View
   * @class app.ui.views.EmployeeDetailView
   * @extends app.ui.views.BaseView
   */
  var EmployeeDetailView = BaseView.extend(function() {
    BaseView.apply(this, arguments);
    this.mapChildView({
      '.revenue-by-category': {
        TView: SmallRevenueByCategoryView,
        model: new Collection(this.model.get('employees'))
      },
      '.bar-chart': {
        TView: FilteredRevenueOverTimeView,
        model: new Collection(this.model.get('orders'))
      }
    });
    this.render();
  }, {
    template: 'templates/detail',
    className: 'detail'
  });

  return EmployeeDetailView;

});