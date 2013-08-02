define(function(require) {

  var BaseController = require('app/net/BaseController'),
      RecentOrdersCollection = require('app/models/RecentOrdersCollection'),
      RecentOrdersView = require('app/ui/pageviews/RecentOrdersView');

  /**
   * Orders controller
   * @class app.net.OrdersController
   * @extends app.net.BaseController
   */
  var OrdersController = BaseController.extend({
    /**
     * Recent orders action, creates a history state and shows a view
     * @method recentOrders
     *
     * @param {Object} params  Action arguments
     * @param {Object} model  History state model
     * @return {Lavaca.util.Promise}  A promise
     */
    recentOrders: function(params, model) {
      return this
        .view(null, RecentOrdersView, new RecentOrdersCollection())
        .then(this.updateState(model, 'Home Page', params.url));
    }
  });

  return OrdersController;

});
