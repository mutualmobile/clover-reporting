define(function(require) {
	var LocalStore = require('lavaca/storage/LocalStore');
  var localStore = new LocalStore('cloverReporting');
	return localStore;
});