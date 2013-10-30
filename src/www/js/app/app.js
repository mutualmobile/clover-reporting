define(function(require) {
  var DashboardController = require('app/net/DashboardController'),
      AuthenticationController = require('app/net/AuthenticationController'),
      Connectivity = require('lavaca/net/Connectivity'),
      CloverApplication = require('app/mvc/CloverApplication'),
      Translation = require('lavaca/util/Translation'),
      History = require('lavaca/net/History'),
      TimeSelectorView = require('app/ui/navigation/TimeSelectorView'),
      timeRangeModel = require('app/models/TimeRangeModel');
  require('lavaca/ui/DustTemplate');
  require('app/misc/dust_extensions');
  require('app/misc/tap_handler');
  require('app/misc/authentication_handler');
  require('app/data/dataHub');

  // Use hash-based history since there's no server-side component supporting the app's routes.
  History.overrideStandardsMode();

  var app = new CloverApplication(function() {
    // Initialize the routes
    this.router.add({
      '/': [DashboardController, 'dashboard'],
      '/zoom': [DashboardController, 'zoom',  {bypassAuth: true}],
      '/employees': [DashboardController, 'employees'],
      '/products': [DashboardController, 'products'],
      '/login': [AuthenticationController, 'login', {bypassAuth: true}],
      '/logout': [AuthenticationController, 'logout']
    });

    // Initialize translations
    Translation.init('en_US');

    this.timeSelector = new TimeSelectorView('#time-selector', timeRangeModel);
  });

  // Setup offline AJAX handler
  Connectivity.registerOfflineAjaxHandler(function() {
    var hasLoaded = Translation.hasLoaded;
    alert(hasLoaded ? Translation.get('error_offline') : 'No internet connection available. Please check your settings and connection and try again.');
  });

  return app;

});