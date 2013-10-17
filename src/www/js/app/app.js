define(function(require) {
  var DashboardController = require('app/net/DashboardController'),
      Connectivity = require('lavaca/net/Connectivity'),
      Application = require('lavaca/mvc/Application'),
      Translation = require('lavaca/util/Translation'),
      TimeSelectorView = require('app/ui/navigation/TimeSelectorView'),
      TimeSwiperView = require('app/ui/navigation/TimeSwiperView'),
      timeRangeModel = require('app/models/TimeRangeModel');
  require('lavaca/ui/DustTemplate');
  require('app/misc/dust_extensions');
  require('app/misc/tap_handler');


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
      '/': [DashboardController, 'dashboard'],
      '/zoom': [DashboardController, 'zoom'],
      '/employees': [DashboardController, 'employees'],
      '/products': [DashboardController, 'products'],
      '/login': [DashboardController, 'login'],
      '/logout': [DashboardController, 'logout']
    });

    // Initialize translations
    Translation.init('en_US');

    this.timeSelector = new TimeSelectorView('#time-selector', timeRangeModel);
    this.timeSwiper = new TimeSwiperView('#time-swiper', timeRangeModel);
  });

  // Setup offline AJAX handler
  Connectivity.registerOfflineAjaxHandler(function() {
    var hasLoaded = Translation.hasLoaded;
    alert(hasLoaded ? Translation.get('error_offline') : 'No internet connection available. Please check your settings and connection and try again.');
  });

  return app;

});