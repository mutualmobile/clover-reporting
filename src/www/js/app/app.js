define(function(require) {
  var History = require('lavaca/net/History');
  var OrdersController = require('app/net/OrdersController');
  var Connectivity = require('lavaca/net/Connectivity');
  var Application = require('lavaca/mvc/Application');
  var Translation = require('lavaca/util/Translation');
  var headerView = require('app/ui/controls/HeaderView');
  require('lavaca/ui/DustTemplate');
  require('jquery-mobile/events/touch');
  require('jquery-mobile/events/orientationchange');


  // Uncomment this section to use hash-based browser history instead of HTML5 history.
  // You should use hash-based history if there's no server-side component supporting your app's routes.
  // History.overrideStandardsMode();

  /**
   * Global application-specific object
   * @class app
   * @extends Lavaca.mvc.Application
   */
  var app = new Application(function() {
    // Initialize the routes
    this.router.add({
      '/': [OrdersController, 'recentOrders']
    });

    // Initialize translations
    Translation.init('en_US');

    // Render header
    headerView.render();
  });

  // Setup offline AJAX handler
  Connectivity.registerOfflineAjaxHandler(function() {
    var hasLoaded = Translation.hasLoaded;
    alert(hasLoaded ? Translation.get('error_offline') : 'No internet connection available. Please check your settings and connection and try again.');
  });

  return app;

});