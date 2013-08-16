define(function(require) {

  var RevenueByCategoryView = require('./RevenueByCategoryView'),
      revenueByItemCollection = require('app/models/RevenueByItemCollection');
  require('rdust!templates/revenue_by_category');

  /**
   * Renders a smaller pie chart showing revenue
   * breakdown by category
   * @class app.ui.views.SmallRevenueByCategoryView
   * @extends app.ui.views.RevenueByCategoryView
   */

  var SmallRevenueByCategoryView = RevenueByCategoryView.extend(function SmallRevenueByCategoryView() {
      RevenueByCategoryView.apply(this, arguments);
      this.render();
    }, {
    template: 'templates/revenue_by_category',
    className: 'base_pie revenue_by_category'
    
  });

  return SmallRevenueByCategoryView;

});