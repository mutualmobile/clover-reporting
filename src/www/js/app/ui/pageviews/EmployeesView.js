define(function(require) {

  var BasePageView = require('./BasePageView'),
      EmployeeCollectionView = require('app/ui/views/EmployeeCollectionView'),
      employeeCollection = require('app/models/EmployeeCollection');

  require('rdust!templates/employees');

  /**
   * Employee View
   * @class app.ui.pageviews.EmployeesView
   * @extends app.ui.pageviews.BasePageView
   */
  var EmployeesView = BasePageView.extend(function EmployeesView() {
    BasePageView.apply(this, arguments);
    this.mapChildView({
      '.employee-list': {
        TView: EmployeeCollectionView,
        model: employeeCollection
      }
    });
  }, {
    template: 'templates/employees',
    className: 'details'
  });

  return EmployeesView;

});