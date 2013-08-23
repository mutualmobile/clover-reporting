define(function(require) {

  var Controller = require('lavaca/mvc/Controller'),
      merge = require('mout/object/merge'),
      stateModel = require('app/models/StateModel'),
      localStore = require('app/cache/localStore');

  /**
   * Base controller
   * @class app.net.BaseController
   * @extends Lavaca.mvc.Controller
   */
  var BaseController = Controller.extend(function(){
      Controller.apply(this, arguments);
    }, {
    exec: function(action, params) {
      var url = params.url;
      if (url === '/login' || (localStore.get('merchantId') && localStore.get('accessToken'))) {
        return Controller.prototype.exec.apply(this, arguments);
      }
      return this.redirect('/login');
    },
    updateState: function(historyState, title, url, stateProps){
      var defaultStateProps = {pageTitle: title};
      this.history(historyState, title, url)();

      stateModel.set('hideHeader', url === '/login');

      stateProps = merge(stateProps || {}, defaultStateProps);
      stateModel.apply(stateProps, true);
      stateModel.trigger('change');
    }
  });

  return BaseController;

});