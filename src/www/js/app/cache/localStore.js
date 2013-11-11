define(function(require) {
	var LocalStore = require('lavaca/storage/LocalStore');
	return new LocalStore('cloverReporting');
});