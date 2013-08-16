define(function(require) {

  var BasePageView = require('./BasePageView'),
      TimeSelectorView = require('app/ui/views/TimeSelectorView'),
      BarChartView = require('app/ui/views/BarChartView'),
      revenueByEmployeeCollection = require('app/models/RevenueByEmployeeCollection'),
      SmallRevenueByCategoryView = require('app/ui/views/SmallRevenueByCategoryView'),
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
        TView: SmallRevenueByCategoryView,
        model: revenueByEmployeeCollection
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