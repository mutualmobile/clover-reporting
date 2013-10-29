define(function(require) {

  var Controller = require('lavaca/mvc/Controller'),
      merge = require('mout/object/merge'),
      stateModel = require('app/models/StateModel'),
      getParam = require('mout/queryString/getParam'),
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
      var accessToken = getParam(location.href, 'access_token'),
          merchantId = getParam(location.href, 'merchant_id');

      if (accessToken && merchantId) {
        _authenticate(accessToken, merchantId);
      }

      if (!_isAuthorized() && !params.bypassAuth) {
        return this.redirect('/login');
      }
      return Controller.prototype.exec.apply(this, arguments);
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

  function _isAuthorized() {
    return localStore.get('accessToken') && localStore.get('merchantId');
  }

  function _authenticate(accessToken, merchantId) {
    localStore.setItem('accessToken', accessToken);
    localStore.setItem('merchantId', merchantId);
  }

  return BaseController;

});