define(function(require) {

  var BasePageView = require('./BasePageView'),
      TimeSelectorView = require('app/ui/views/TimeSelectorView'),
      BarChartView = require('app/ui/views/BarChartView'),
      recentOrdersCollection = require('app/models/RecentOrdersCollection'),
      RevenueByCategoryView = require('app/ui/views/RevenueByCategoryView'),
      timeRangeModel = require('app/models/TimeRangeModel');

  require('rdust!templates/employees');

  /**
   * Employee View
   * @class app.ui.pageviews.EmployeesView
   * @extends app.ui.pageviews.BasePageView
   */
  var EmployeesView = BasePageView.extend(function() {
    BasePageView.apply(this, arguments);
    this.mapChildView({
      '.time-selector': {
        TView: TimeSelectorView,
        model: timeRangeModel
      },
      '.bar-chart': {
        TView: BarChartView
      },
      '.revenue-by-category':{
        TView: RevenueByCategoryView,
        model: recentOrdersCollection
      }
    });
  }, {
    /**
     * The name of the template used by the view
     * @property {String} template
     * @default 'example'
     */
    template: 'templates/employees',
    /**
     * A class name added to the view container
     * @property {String} className
     * @default 'example'
     */
    className: 'employees'

  });

  return EmployeesView;

});