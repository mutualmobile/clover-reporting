define(function(require) {

  var BasePageView = require('./BasePageView'),
      Scrollable = require('lavaca/ui/Scrollable'),
      RecentOrdersView = require('app/ui/views/RecentOrdersView'),
      recentOrdersCollection = require('app/models/RecentOrdersCollection'),
      revenueByCategoryCollection = require('app/models/RevenueByCategoryCollection'),
      RevenueByCategoryView = require('app/ui/views/RevenueByCategoryView'),
      RevenueByEmployeeView = require('app/ui/views/RevenueByEmployeeView'),
      RevenueOverTimeView = require('app/ui/views/RevenueOverTimeView'),
      TimeSelectorView = require('app/ui/views/TimeSelectorView'),
      timeRangeModel = require('app/models/TimeRangeModel');

  require('rdust!templates/dashboard');

  /**
   * Dashboard View
   * @class app.ui.pageviews.DashboardView
   * @extends app.ui.pageviews.BasePageView
   */
  var DashboardView = BasePageView.extend(function() {
    BasePageView.apply(this, arguments);
    this.mapWidget({
      'self': Scrollable
    });
    this.mapChildView({
      '.recent-orders-total': {
        TView: RecentOrdersView,
        model: recentOrdersCollection
      },
      '.revenue-graph': {
        TView: RevenueOverTimeView,
        model: recentOrdersCollection
      },
      '.revenue-by-category': {
        TView: RevenueByCategoryView,
        model: revenueByCategoryCollection
      },
      '.revenue-by-employee': {
        TView: RevenueByEmployeeView,
        model: recentOrdersCollection
      },
      '.time-selector': {
        TView: TimeSelectorView,
        model: timeRangeModel
      }
    });
  }, {
    /**
     * The name of the template used by the view
     * @property {String} template
     * @default 'example'
     */
    template: 'templates/dashboard',
    /**
     * A class name added to the view container
     * @property {String} className
     * @default 'example'
     */
    className: 'dashboard'

  });

  return DashboardView;

});