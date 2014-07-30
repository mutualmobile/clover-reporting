// Use Only For OAUTH Method and not TOKEN method

define(function(require) {
  var localStore = require('app/cache/localStore'),
      stateModel = require('app/models/global/StateModel'),
      Device = require('lavaca/env/Device'),
      tracker = require('app/analytics/tracker');
  var _isCordova = Device.isCordova();
  if (!_isCordova) {
    var tokenMatch = location.href.match(/access_token=([^&]+)/),
        merchantIdMatch = location.href.match(/merchant_id=([^&+]+)/);

    if (tokenMatch &&
        tokenMatch.length > 1 &&
        merchantIdMatch &&
        merchantIdMatch.length > 1) {
      localStore.set('accessToken', tokenMatch[1]);
      localStore.set('merchantId', merchantIdMatch[1]);
      stateModel.set('loggedIn', true);

    }

    tracker.setUserDimension('dimension1', '' + (!!stateModel.get('loggedIn')));
  };
});