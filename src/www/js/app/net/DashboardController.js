define(function(require) {

  var BaseController = require('app/net/BaseController'),
      DashboardView = require('app/ui/pageviews/DashboardView'),
      Model = require('lavaca/mvc/Model'),
      Promise = require('lavaca/util/Promise'),
      timeRangeModel = require('app/models/TimeRangeModel'),
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
    zoom: function(params, model) {
      if (params.startTime && params.endTime) {
        timeRangeModel.suppressEvents = true;
        timeRangeModel.apply({
          customStartTime: moment(params.startTime),
          customEndTime: moment(params.endTime),
          mode: 'custom'
        });
        timeRangeModel.suppressEvents = false;
        timeRangeModel.trigger('rangeUpdate');
      }
      return new Promise().resolve();
    }
  });

  return DashboardController;

});
