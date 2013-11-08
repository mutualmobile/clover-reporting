define(function(require) {
  var DashboardController = require('app/net/DashboardController'),
      AuthenticationController = require('app/net/AuthenticationController'),
      CloverApplication = require('app/mvc/CloverApplication'),
      Translation = require('lavaca/util/Translation'),
      History = require('lavaca/net/History'),
      TimeSelectorView = require('app/ui/navigation/TimeSelectorView'),
      timeRangeModel = require('app/models/global/TimeRangeModel');
  require('lavaca/ui/DustTemplate');
  require('app/misc/dust_extensions');
  require('app/misc/hammer_extensions');
  require('app/misc/authentication_handler');
  require('app/data/dataHub');

  // Use hash-based history since there's no server-side component supporting the app's routes.
  History.overrideStandardsMode();

  var app = new CloverApplication(function() {
    // Initialize the routes
    this.router.add({
      '/': [DashboardController, 'dashboard'],
      '/employees': [DashboardController, 'employees'],
      '/products': [DashboardController, 'products'],
      '/login': [AuthenticationController, 'login', {bypassAuth: true}],
      '/logout': [AuthenticationController, 'logout']
    });

    // Initialize translations
    Translation.init('en_US');

    this.timeSelector = new TimeSelectorView('#time-selector', timeRangeModel);
  });

  return app;

});