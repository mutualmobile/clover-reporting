define(function(require) {
  var BaseView = require('./BaseView'),
      Collection = require('lavaca/mvc/Collection'),
      SmallRevenueByCategoryView = require('app/ui/views/SmallRevenueByCategoryView');

  require('rdust!templates/employee_detail');

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
        model: new Collection(this.model.get('revenueByCategory'))
      }
    });
    this.render();
  }, {
    template: 'templates/employee_detail',
    className: 'employee'

  });

  return EmployeeDetailView;

});