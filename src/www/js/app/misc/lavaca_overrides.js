define(function(require) {
  var History = require('lavaca/net/History'),
      Model = require('lavaca/mvc/Model');

  // Use hash-based history since there's no server-
  // side component supporting the app's routes.
  History.overrideStandardsMode();

  // Turn off tracking because we don't
  // sync model changes with the server
  Model.prototype.suppressTracking = true;
});