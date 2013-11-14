define(function(require) {

  var Controller = require('lavaca/mvc/Controller'),
      merge = require('mout/object/merge'),
      $ = require('$'),
      stateModel = require('app/models/global/StateModel');

  /**
   * Base controller
   * @class app.net.BaseController
   * @extends Lavaca.mvc.Controller
   */
  var BaseController = Controller.extend(function(){
      Controller.apply(this, arguments);
    }, {
    exec: function(action, params) {
      if (!_isAuthorized() && !params.bypassAuth) {
        return this.redirect('/login');
      }
      $(document.body).toggleClass('hide-spinner', !!params.hideLoading);
      return Controller.prototype.exec.apply(this, arguments);
    },
    updateState: function(historyState, title, url, stateProps){
      var defaultStateProps = {pageTitle: title};
      this.history(historyState, title, url)();

      stateModel.set('hideHeader', !!(stateProps && stateProps.hideHeader));

      stateProps = merge(stateProps || {}, defaultStateProps);
      stateModel.apply(stateProps, true);
      stateModel.trigger('change');
    }
  });

  function _isAuthorized() {
    return stateModel.get('loggedIn');
  }

  return BaseController;

});