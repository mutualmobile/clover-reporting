define(function(require) {

  var BaseView = require('app/ui/BaseView'),
      EmployeeCollectionView = require('app/ui/collections/EmployeeCollectionView'),
      EmployeesCollection = require('app/models/collection/EmployeesCollection');

  require('rdust!templates/employees_detail_list');

  /**
   * Employee View
   * @class app.ui.pages.EmployeesView
   * @extends app.ui.BaseView
   */
  var EmployeesView = BaseView.extend(function EmployeesView() {
    BaseView.apply(this, arguments);
    this.mapChildView({
      '.list': {
        TView: EmployeeCollectionView,
        model: new EmployeesCollection()
      }
    });
  }, {
    template: 'templates/employees_detail_list',
    className: 'details',
    trackerLabel: 'Employee'
  });

  return EmployeesView;

});