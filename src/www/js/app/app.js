define(function(require) {
  var DashboardController = require('app/net/DashboardController'),
      AuthenticationController = require('app/net/AuthenticationController'),
      CloverApplication = require('app/mvc/CloverApplication'),
      Translation = require('lavaca/util/Translation'),
      Detection = require('lavaca/env/Detection'),
      TimeSelectorView = require('app/ui/navigation/TimeSelectorView'),
      timeRangeModel = require('app/models/global/TimeRangeModel'),
      LoadingSpinner = require('app/ui/widgets/LoadingSpinner');
  require('lavaca/ui/DustTemplate');
  require('app/misc/lavaca_overrides');
  require('app/misc/dust_extensions');
  require('app/misc/hammer_extensions');
  require('app/misc/authentication_handler');
  require('app/misc/cordovaOauth');
  require('app/data/dataHub');
  require('app/customization/nv_tooltip_triangle_positioning');

  var app = new CloverApplication(function() {
    if (Detection.android === true) {$('body').addClass('mobile')}
    // Initialize the routes
    this.router.add({
      '/': [DashboardController, 'dashboard'],
      '/employees': [DashboardController, 'employees'],
      '/products': [DashboardController, 'products'],
      '/login': [AuthenticationController, 'login', {bypassAuth: true, hideLoading: true}],
      '/logout': [AuthenticationController, 'logout'],
      '/end-user-agreement': [AuthenticationController, 'agreement', {bypassAuth: true, hideLoading: true}],
      '/support': [AuthenticationController, 'support', {bypassAuth: true, hideLoading: true}],
      '/getToken': [AuthenticationController, 'getToken', {bypassAuth: true,  hideLoading: true}],
      '/privacy-policy': [AuthenticationController, 'privacy', {bypassAuth: true, hideLoading: true}]
    });



    // Initialize translations
    Translation.init('en_US');

    // Initialize loading spinner
    LoadingSpinner.init();

    this.timeSelector = new TimeSelectorView('#time-selector', timeRangeModel);
  });

  return app;

});