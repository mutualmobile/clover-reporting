define(function(require) {

  var BaseController = require('app/net/BaseController'),
      DashboardView = require('app/ui/pages/DashboardView'),
      EmployeesView = require('app/ui/pages/EmployeesView'),
      ProductsView = require('app/ui/pages/ProductsView'),
      Model = require('lavaca/mvc/Model');

  /**
   * Dashboard controller
   * @class app.net.DashboardController
   * @extends app.net.BaseController
   */
  var DashboardController = BaseController.extend({
    /**
     * Dashboard action, creates a history state and shows a view
     * @method dashboard
     *
     * @param {Object} params  Action arguments
     * @param {Object} history  History state model
     * @return {Lavaca.util.Promise}  A promise
     */
    dashboard: function(params, history) {
      return this
        .view(null, DashboardView, new Model())
        .then(this.updateState(history, 'Dashboard', params.url));
    },
    employees: function(params, history) {
      return this
        .view(null, EmployeesView, new Model())
        .then(this.updateState(history, 'Employees', params.url));
    },
    items: function(params, history) {
      return this
        .view(null, ProductsView, new Model())
        .then(this.updateState(history, 'Items', params.url));
    }
  });

  return DashboardController;

});
