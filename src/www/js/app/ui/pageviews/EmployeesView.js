define(function(require) {

  var BasePageView = require('./BasePageView'),
      BarChartView = require('app/ui/views/BarChartView'),
      revenueByCategoryCollection = require('app/models/RevenueByCategoryCollection'),
      SmallRevenueByCategoryView = require('app/ui/views/SmallRevenueByCategoryView');
  require('rdust!templates/employees');

  /**
   * Employee View
   * @class app.ui.pageviews.EmployeesView
   * @extends app.ui.pageviews.BasePageView
   */
  var EmployeesView = BasePageView.extend(function() {
    BasePageView.apply(this, arguments);
    this.mapChildView({
      '.bar-chart': {
        TView: BarChartView
      },
      '.revenue-by-category': {
        TView: SmallRevenueByCategoryView,
        model: revenueByCategoryCollection
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