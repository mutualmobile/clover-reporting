define(function(require) {
  var Model = require('lavaca/mvc/Model'),
      localStore = require('app/cache/localStore');

  var StateModel = Model.extend(function StateModel() {
    Model.apply(this, arguments);
    this.set('loggedIn', localStore.get('merchantId') && localStore.get('accessToken'));
    this.set('loading', true);
    this.on('change', 'loading', function(e) {
      console.log('LOADING: ' + e.value);
    });
  });

  return new StateModel();
});