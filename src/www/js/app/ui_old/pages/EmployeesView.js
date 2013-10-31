define(function(require) {

  var BaseView = require('app/ui/BaseView'),
      EmployeeCollectionView = require('app/ui/collections/EmployeeCollectionView'),
      employeeCollection = require('app/models_old/EmployeeCollection');

  require('rdust!templates/employees');

  /**
   * Employee View
   * @class app.ui.pages.EmployeesView
   * @extends app.ui.BaseView
   */
  var EmployeesView = BaseView.extend(function EmployeesView() {
    BaseView.apply(this, arguments);
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