define(function(require) {

  var BaseController = require('app/net/BaseController'),
      DashboardView = require('app/ui/pages/DashboardView'),
      EmployeesView = require('app/ui/pages/EmployeesView'),
      ProductsView = require('app/ui/pages/ProductsView'),
      LoginView = require('app/ui/pages/LoginView'),
      Model = require('lavaca/mvc/Model'),
      Promise = require('lavaca/util/Promise'),
      localStore = require('app/cache/localStore'),
      timeRangeModel = require('app/models/TimeRangeModel'),
      stateModel = require('app/models/StateModel'),
      moment = require('moment');

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
     * @param {Object} model  History state model
     * @return {Lavaca.util.Promise}  A promise
     */
    dashboard: function(params, model) {
      return this
        .view(null, DashboardView, new Model())
        .then(this.updateState(model, 'Dashboard', params.url));
    },
    employees: function(params, model) {
      return this
        .view(null, EmployeesView, new Model())
        .then(this.updateState(model, 'Employees', params.url));
    },
    products: function(params, model) {
      return this
        .view(null, ProductsView, new Model())
        .then(this.updateState(model, 'Products', params.url));
    },
    login: function(params, model) {
      return this
        .view(null, LoginView, new Model())
        .then(this.updateState(model, 'Login', params.url));
    },
    logout: function() {
      localStore.remove('merchantId');
      localStore.remove('accessToken');
      stateModel.set('loggedIn', false);
      return this.redirect('/login');
    },
    zoom: function(params, model) {
      if (params.startTime && params.endTime) {
        timeRangeModel.suppressEvents = true;
        timeRangeModel.apply({
          startTime: moment(params.startTime),
          endTime: moment(params.endTime)
        });
        timeRangeModel.suppressEvents = false;
        timeRangeModel.trigger('rangeUpdate');
      }
      return new Promise().resolve();
    }
  });

  return DashboardController;

});
