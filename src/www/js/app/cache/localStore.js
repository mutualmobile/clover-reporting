define(function(require) {
	var LocalStore = require('lavaca/storage/LocalStore');
  var localStore = new LocalStore('clover'); // change 'lavaca_app' to your namespace
	return localStore;
});